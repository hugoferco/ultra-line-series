'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function MonEspace() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [inscription, setInscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pps, setPps] = useState('')
  const [ppsBinome, setPpsBinome] = useState('')
  const [ppsSaving, setPpsSaving] = useState(false)
  const [ppsSaved, setPpsSaved] = useState(false)

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
        const { data } = await supabase
          .from('inscriptions')
          .select('*')
          .eq('token', token)
          .single()
        
        setInscription(data)
        if (data) {
          setPps(data.code_pps || '')
          setPpsBinome(data.code_pps_binome || '')
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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/30 text-xs tracking-widest uppercase">Chargement...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <div className="flex-1 px-8 py-16">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="flex justify-between items-start mb-16">
            <div>
              <p className="text-xs tracking-[0.4em] text-white/40 uppercase mb-2">Ultra Line Series — Edition 00</p>
              <h1 className="text-3xl font-black uppercase">
                Bonjour {user?.user_metadata?.prenom}.
              </h1>
            </div>
            <div className="flex gap-6">
              <button
                onClick={() => router.push('/mon-espace/modifier')}
                className="text-[10px] tracking-[0.3em] text-white/20 uppercase hover:text-white/60 transition-all"
              >
                Modifier
              </button>
              <button
                onClick={handleLogout}
                className="text-[10px] tracking-[0.3em] text-white/20 uppercase hover:text-white/60 transition-all"
              >
                Deconnexion
              </button>
            </div>
          </div>

          {/* Statut */}
          <div className="border border-white/10 p-8 mb-6">
            <p className="text-xs tracking-[0.4em] text-white/30 uppercase mb-6">Statut</p>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${inscription?.paye ? 'bg-green-400' : 'bg-yellow-400'}`} />
              <span className="text-sm tracking-widest uppercase">
                {inscription?.paye ? 'Inscription confirmee' : 'En attente de paiement'}
              </span>
            </div>
          </div>

          {/* Infos course */}
          <div className="border border-white/10 p-8 mb-6">
            <p className="text-xs tracking-[0.4em] text-white/30 uppercase mb-6">La course</p>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-xs tracking-[0.3em] text-white/40 uppercase">Lieu</span>
                <span className="text-sm text-white/70">Pyrenees</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-xs tracking-[0.3em] text-white/40 uppercase">Dates</span>
                <span className="text-sm text-white/70">18 — 20 Septembre 2026</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs tracking-[0.3em] text-white/40 uppercase">Format</span>
                <span className="text-sm text-white/70">3 jours — Duo</span>
              </div>
            </div>
          </div>

          {/* Binome */}
          {inscription && (
            <div className="border border-white/10 p-8 mb-6">
              <p className="text-xs tracking-[0.4em] text-white/30 uppercase mb-6">Mon binome</p>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-xs tracking-[0.3em] text-white/40 uppercase">Nom</span>
                  <span className="text-sm text-white/70">{inscription.prenom_binome} {inscription.nom_binome}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-xs tracking-[0.3em] text-white/40 uppercase">Email</span>
                  <span className="text-sm text-white/70">{inscription.email_binome}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs tracking-[0.3em] text-white/40 uppercase">Telephone</span>
                  <span className="text-sm text-white/70">{inscription.telephone_binome}</span>
                </div>
              </div>
            </div>
          )}

          {/* Codes PPS */}
          {inscription && (
            <div className="border border-white/10 p-8 mb-6">
              <p className="text-xs tracking-[0.4em] text-white/30 uppercase mb-2">Codes PPS</p>
              <p className="text-xs text-white/20 mb-6">Le code PPS est requis pour votre dossier d'inscription.</p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs tracking-[0.3em] text-white/40 uppercase">Mon code PPS</label>
                  <input
                    value={pps}
                    onChange={e => setPps(e.target.value)}
                    placeholder="Ex: 1234567890123"
                    className="bg-white/5 border border-white/10 text-white text-sm px-4 py-3 rounded focus:outline-none focus:border-white/30 transition-all placeholder:text-white/20"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs tracking-[0.3em] text-white/40 uppercase">Code PPS de mon binôme</label>
                  <input
                    value={ppsBinome}
                    onChange={e => setPpsBinome(e.target.value)}
                    placeholder="Ex: 1234567890123"
                    className="bg-white/5 border border-white/10 text-white text-sm px-4 py-3 rounded focus:outline-none focus:border-white/30 transition-all placeholder:text-white/20"
                  />
                </div>
                <button
                  onClick={handleSavePps}
                  disabled={ppsSaving}
                  className="mt-2 bg-white text-black text-xs tracking-[0.3em] uppercase px-6 py-3 hover:bg-white/80 transition-all disabled:opacity-50 self-start"
                >
                  {ppsSaving ? 'Sauvegarde...' : ppsSaved ? 'Sauvegarde ✓' : 'Sauvegarder'}
                </button>
              </div>
            </div>
          )}

          {/* Mes infos */}
          <div className="border border-white/10 p-8">
            <p className="text-xs tracking-[0.4em] text-white/30 uppercase mb-6">Mes infos</p>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-xs tracking-[0.3em] text-white/40 uppercase">Nom</span>
                <span className="text-sm text-white/70">{user?.user_metadata?.prenom} {user?.user_metadata?.nom}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs tracking-[0.3em] text-white/40 uppercase">Email</span>
                <span className="text-sm text-white/70">{user?.email}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </main>
  )
}