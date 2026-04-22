'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Footer from '@/app/components/Footer'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function InfoRow({ label, value, last = false }) {
  return (
    <div className={`flex justify-between items-center py-3 ${!last ? 'border-b border-gray-100' : ''}`}>
      <span className="text-xs text-gray-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm text-gray-700 text-right max-w-xs">{value || <span className="text-gray-300 italic">—</span>}</span>
    </div>
  )
}

export default function MonEspace() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [inscription, setInscription] = useState(null)
  const [candidature, setCandidature] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pps, setPps] = useState('')
  const [ppsBinome, setPpsBinome] = useState('')
  const [ppsSaving, setPpsSaving] = useState(false)
  const [ppsSaved, setPpsSaved] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentErreur, setPaymentErreur] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)
      const token = user.user_metadata?.token

      if (token) {
        const [{ data: inscriptionData }, { data: candidatureData }] = await Promise.all([
          supabase.from('inscriptions').select('*').eq('token', token).single(),
          supabase.from('candidatures').select('*').eq('token', token).single(),
        ])

        setInscription(inscriptionData)
        setCandidature(candidatureData)

        if (inscriptionData) {
          setPps(inscriptionData.code_pps || '')
          setPpsBinome(inscriptionData.code_pps_binome || '')
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  const handleSavePps = async () => {
    if (!inscription) return
    setPpsSaving(true)
    await supabase.from('inscriptions').update({ code_pps: pps, code_pps_binome: ppsBinome }).eq('id', inscription.id)
    setPpsSaving(false)
    setPpsSaved(true)
    setTimeout(() => setPpsSaved(false), 2000)
  }

  const handlePayer = async () => {
    setPaymentLoading(true)
    setPaymentErreur('')
    const token = user.user_metadata?.token

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })

    const data = await res.json()

    if (!res.ok || data.error) {
      setPaymentErreur(data.error || 'Une erreur est survenue')
      setPaymentLoading(false)
      return
    }

    window.location.href = data.url
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-xs tracking-widest uppercase">Chargement...</p>
      </main>
    )
  }

  const estPaye = inscription?.paye === true

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">

      {/* Topbar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-black uppercase tracking-tight">Mon Espace</h1>
          <span className="text-xs text-gray-400 tracking-widest uppercase">Édition 00</span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push('/mon-espace/modifier')}
            className="text-xs text-gray-400 uppercase tracking-widest hover:text-gray-700 transition-all"
          >
            Modifier
          </button>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 uppercase tracking-widest hover:text-gray-700 transition-all"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-10 w-full flex-1">

        {/* Titre */}
        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Ultra Line Series — Édition 00</p>
          <h2 className="text-2xl font-black uppercase">Bonjour {user?.user_metadata?.prenom}.</h2>
        </div>

        {/* Statut + Paiement */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Statut de l'inscription</p>

          <div className="flex items-center gap-3 mb-6">
            <div className={`w-2 h-2 rounded-full ${estPaye ? 'bg-green-500' : 'bg-yellow-400'}`} />
            <span className={`text-sm font-bold uppercase tracking-widest ${estPaye ? 'text-green-600' : 'text-yellow-600'}`}>
              {estPaye ? 'Inscription confirmée — Paiement reçu' : 'En attente de paiement'}
            </span>
          </div>

          {!estPaye && (
            <div>
              <div className="flex justify-between items-center bg-gray-50 rounded p-4 mb-4">
                <div>
                  <p className="text-sm font-bold text-gray-900">Inscription binôme</p>
                  <p className="text-xs text-gray-400 mt-0.5">18 au 20 Septembre 2026 — Pyrénées</p>
                </div>
                <span className="text-2xl font-black text-gray-900">890 €</span>
              </div>
              {paymentErreur && (
                <p className="text-red-500 text-xs mb-3">{paymentErreur}</p>
              )}
              <button
                onClick={handlePayer}
                disabled={paymentLoading}
                className="w-full bg-black text-white text-xs tracking-[0.3em] uppercase px-6 py-4 rounded hover:bg-gray-800 transition-all disabled:opacity-40"
              >
                {paymentLoading ? 'Redirection vers le paiement...' : 'Procéder au paiement ↘'}
              </button>
            </div>
          )}
        </div>

        {/* Infos course */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">La course</p>
          <InfoRow label="Lieu" value="Pyrénées" />
          <InfoRow label="Dates" value="18 — 20 Septembre 2026" />
          <InfoRow label="Format" value="3 jours — Duo" />
          <InfoRow label="Édition" value="00" last />
        </div>

        {/* Participant 1 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">
            Participant 1 — {user?.user_metadata?.prenom} {user?.user_metadata?.nom}
          </p>
          <InfoRow label="Nom" value={`${user?.user_metadata?.prenom} ${user?.user_metadata?.nom}`} />
          <InfoRow label="Email" value={user?.email} />
          {candidature?.telephone && <InfoRow label="Téléphone" value={candidature.telephone} />}
          {candidature?.adresse && <InfoRow label="Adresse" value={candidature.adresse} last />}
        </div>

        {/* Participant 2 */}
        {candidature && (candidature.prenom_binome || candidature.nom_binome) && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">
              Participant 2 — {candidature.prenom_binome} {candidature.nom_binome}
            </p>
            <InfoRow label="Nom" value={`${candidature.prenom_binome} ${candidature.nom_binome}`} />
            <InfoRow label="Email" value={candidature.email_binome} />
            <InfoRow label="Téléphone" value={candidature.telephone_binome} />
            {candidature.adresse_binome && <InfoRow label="Adresse" value={candidature.adresse_binome} last />}
          </div>
        )}

        {/* Pass Prévention Santé */}
        {estPaye && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Pass Prévention Santé (PPS)</p>
            <p className="text-xs text-gray-400 mb-6">
              Le Pass Prévention Santé est requis pour votre dossier d'inscription. Renseignez-le dès que possible.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-500 uppercase tracking-widest">
                  PPS — {user?.user_metadata?.prenom} {user?.user_metadata?.nom}
                </label>
                <input
                  value={pps}
                  onChange={e => setPps(e.target.value)}
                  placeholder="Numéro PPS"
                  className="border border-gray-200 text-gray-900 text-sm px-4 py-3 rounded focus:outline-none focus:border-gray-400 transition-all placeholder:text-gray-300"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-500 uppercase tracking-widest">
                  PPS — {candidature?.prenom_binome} {candidature?.nom_binome}
                </label>
                <input
                  value={ppsBinome}
                  onChange={e => setPpsBinome(e.target.value)}
                  placeholder="Numéro PPS"
                  className="border border-gray-200 text-gray-900 text-sm px-4 py-3 rounded focus:outline-none focus:border-gray-400 transition-all placeholder:text-gray-300"
                />
              </div>
              <button
                onClick={handleSavePps}
                disabled={ppsSaving}
                className="bg-black text-white text-xs tracking-[0.3em] uppercase px-6 py-3 rounded hover:bg-gray-800 transition-all disabled:opacity-50 self-start"
              >
                {ppsSaving ? 'Sauvegarde...' : ppsSaved ? 'Sauvegardé ✓' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        )}

      </div>

      <Footer />
    </main>
  )
}
