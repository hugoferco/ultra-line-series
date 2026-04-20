'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const MOT_DE_PASSE = 'uls2026'

export default function Admin() {
  const [authentifie, setAuthentifie] = useState(false)
  const [mdp, setMdp] = useState('')
  const [erreur, setErreur] = useState(false)
  const [candidatures, setCandidatures] = useState([])
  const [loading, setLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    if (mdp === MOT_DE_PASSE) {
      setAuthentifie(true)
      setErreur(false)
    } else {
      setErreur(true)
    }
  }

  useEffect(() => {
    if (authentifie) {
      fetchCandidatures()
    }
  }, [authentifie])

  const fetchCandidatures = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('candidatures')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setCandidatures(data)
    setLoading(false)
  }

  if (!authentifie) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-8">
        <p className="text-xs tracking-[0.4em] text-white/40 uppercase mb-8">Zone privee — ULS Admin</p>
        <form onSubmit={handleLogin} className="w-full max-w-xs flex flex-col gap-4">
          <input
            type="password"
            value={mdp}
            onChange={(e) => setMdp(e.target.value)}
            className="bg-transparent border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
            placeholder="Mot de passe"
          />
          {erreur && (
            <p className="text-red-400 text-xs tracking-widest text-center">Mot de passe incorrect</p>
          )}
          <button
            type="submit"
            className="border border-white/20 text-white text-xs tracking-[0.4em] uppercase px-10 py-4 hover:bg-white hover:text-black transition-all duration-300"
          >
            Entrer
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white px-8 py-12">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex justify-between items-center mb-12">
          <div>
            <p className="text-xs tracking-[0.4em] text-white/40 uppercase mb-2">Ultra Line Series</p>
            <h1 className="text-3xl font-black uppercase">Candidatures</h1>
          </div>
          <span className="text-xs tracking-[0.3em] text-white/30 uppercase">{candidatures.length} dossiers</span>
        </div>

        {loading ? (
          <p className="text-white/30 text-xs tracking-widest text-center py-20">Chargement...</p>
        ) : candidatures.length === 0 ? (
          <p className="text-white/30 text-xs tracking-widest text-center py-20">Aucune candidature pour le moment</p>
        ) : (
          <div className="flex flex-col gap-4">
            {candidatures.map((c) => (
              <div key={c.id} className="border border-white/10 p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-wide">{c.prenom} {c.nom}</h2>
                    <p className="text-white/40 text-xs tracking-widest mt-1">{c.telephone} — {c.adresse}</p>
                  </div>
                  <span className="text-[10px] tracking-[0.3em] text-white/20 uppercase">
                    {new Date(c.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="border-t border-white/5 pt-4">
                  <p className="text-xs tracking-[0.3em] text-white/30 uppercase mb-2">Motivation</p>
                  <p className="text-white/60 text-sm leading-relaxed">{c.motivation}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}