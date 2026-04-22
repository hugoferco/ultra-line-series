import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(req) {
  const { token } = await req.json()

  if (!token) {
    return Response.json({ error: 'Token manquant' }, { status: 400 })
  }

  // Récupérer les données du binôme depuis la candidature
  const { data: candidature, error: candError } = await supabase
    .from('candidatures')
    .select('id, prenom_binome, nom_binome, email_binome, telephone_binome')
    .eq('token', token)
    .eq('selectionne', true)
    .single()

  if (candError || !candidature) {
    return Response.json({ error: 'Token invalide' }, { status: 400 })
  }

  // Vérifier si une inscription payée existe déjà
  const { data: existing } = await supabase
    .from('inscriptions')
    .select('id, paye')
    .eq('token', token)
    .single()

  if (existing?.paye) {
    return Response.json({ error: 'Inscription déjà payée' }, { status: 400 })
  }

  // Supprimer l'inscription non payée précédente pour éviter les doublons
  if (existing && !existing.paye) {
    await supabase.from('inscriptions').delete().eq('id', existing.id)
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Ultra Line Series — Édition 00',
            description: 'Inscription binôme — 18 au 20 Septembre 2026, Pyrénées',
          },
          unit_amount: 89000,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/confirmation?token=${token}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/mon-espace`,
  })

  await supabase.from('inscriptions').insert([{
    candidature_id: candidature.id,
    token,
    prenom_binome: candidature.prenom_binome,
    nom_binome: candidature.nom_binome,
    email_binome: candidature.email_binome,
    telephone_binome: candidature.telephone_binome,
    stripe_session_id: session.id,
  }])

  return Response.json({ url: session.url })
}
