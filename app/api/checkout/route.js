import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(req) {
  const body = await req.json()
  const { token, nom_binome, prenom_binome, email_binome, telephone_binome, candidature_id } = body

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Ultra Line Series — Edition 00',
            description: 'Inscription binome — 18 au 20 Septembre 2026, Pyrenees',
          },
          unit_amount: 89000,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/confirmation?token=${token}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/inscription/${token}`,
  })

  await supabase.from('inscriptions').insert([{
    candidature_id,
    token,
    nom_binome,
    prenom_binome,
    email_binome,
    telephone_binome,
    stripe_session_id: session.id,
  }])

  return Response.json({ url: session.url })
}