'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Inscription() {
  const { token } = useParams()
  const [etape, setEtape] = useState(1)
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState('')

  const [compte, setCompte] = useState({
    email: '', mot_de_passe: '', mot_de_passe_confirm: '', prenom: '', nom: ''
  })

  const [binome, setBinome] = useState({
    prenom_binome: '', nom_binome: '', email_binome: '', telephone_binome: ''
  })

  const handleCompteChange = (e) => {
    setCompte({ ...compte, [e.target.name]: e.target.value })
  }

  const handleBinomeChange = (e) => {
    setBinome({ ...binome, [e.target.name]: e.target.value })
  }

  const handleCreerCompte = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErreur('')

    if (compte.mot_de_passe !== compte.mot_de_passe_confirm) {
      setErreur('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email: compte.email,
      password: compte.mot_de_passe,
      options: {
        data: {
          prenom: compte.prenom,
          nom: compte.nom,
          token: token,
        }
      }
    })

    if (error) {
      setErreur(error.message)
      setLoading(false)
      return
    }

    setEtape(2)
    setLoading(false)
  }

  const handlePayer = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErreur('')

    const { data: candidature } = await supabase
      .from('candidatures')
      .select('id')
      .eq('token', token)
      .single()

    if (!candidature) {
      setErreur('Token invalide')
      setLoading(false)
      return
    }

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...binome,
        token,
        candidature_id: candidature.id,
      }),
    })

    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">

        {/* Etapes */}
        <div className="flex gap-4 mb-12">
          <div className={`flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase ${etape === 1 ? 'text-white' : 'text-white/30'}`}>
            <span className={`w-5 h-5 flex items-center justify-center border text-[10px] ${etape === 1 ? 'border-white' : 'border-white/20'}`}>1</span>
            Mon compte
          </div>
          <span className="text-white/20">—</span>
          <div className={`flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase ${etape === 2 ? 'text-white' : 'text-white/30'}`}>
            <span className={`w-5 h-5 flex items-center justify-center border text-[10px] ${etape === 2 ? 'border-white' : 'border-white/20'}`}>2</span>
            Mon binome
          </div>
        </div>

        {/* Etape 1 */}
        {etape === 1 && (
          <>
            <div className="w-full max-w-xl mb-12 text-center">
              <p className="text-xs tracking-[0.4em] text-white/40 uppercase mb-4">Ultra Line Series — Edition 00</p>
              <h1 className="text-3xl md:text-5xl font-black uppercase leading-tight mb-4">
                Mon<br /><span className="text-white/30">Compte.</span>
              </h1>
              <p className="text-white/30 text-xs tracking-widest">
                Creez votre espace personnel pour finaliser votre inscription.
              </p>
            </div>

            <form onSubmit={handleCreerCompte} className="w-full max-w-xl flex flex-col gap-6">

              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Prenom</label>
                  <input
                    type="text"
                    name="prenom"
                    required
                    value={compte.prenom}
                    onChange={handleCompteChange}
                    className="bg-transparent border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
                    placeholder="Jean"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    required
                    value={compte.nom}
                    onChange={handleCompteChange}
                    className="bg-transparent border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
                    placeholder="Dupont"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={compte.email}
                  onChange={handleCompteChange}
                  className="bg-transparent border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
                  placeholder="jean@email.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Mot de passe</label>
                <input
                  type="password"
                  name="mot_de_passe"
                  required
                  minLength={8}
                  value={compte.mot_de_passe}
                  onChange={handleCompteChange}
                  className="bg-transparent border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
                  placeholder="8 caracteres minimum"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Confirmer le mot de passe</label>
                <input
                  type="password"
                  name="mot_de_passe_confirm"
                  required
                  minLength={8}
                  value={compte.mot_de_passe_confirm}
                  onChange={handleCompteChange}
                  className="bg-transparent border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
                  placeholder="8 caracteres minimum"
                />
              </div>

              {erreur && (
                <p className="text-red-400 text-xs tracking-widest text-center">{erreur}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="border border-white/20 text-white text-xs tracking-[0.4em] uppercase px-10 py-4 hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-40"
              >
                {loading ? 'Creation...' : 'Creer mon compte ↘'}
              </button>

            </form>
          </>
        )}

        {/* Etape 2 */}
        {etape === 2 && (
          <>
            <div className="w-full max-w-xl mb-12 text-center">
              <p className="text-xs tracking-[0.4em] text-white/40 uppercase mb-4">Ultra Line Series — Edition 00</p>
              <h1 className="text-3xl md:text-5xl font-black uppercase leading-tight mb-4">
                Mon<br /><span className="text-white/30">Binome.</span>
              </h1>
              <p className="text-white/30 text-xs tracking-widest">
                Renseignez les informations de votre partenaire.
              </p>
            </div>

            <form onSubmit={handlePayer} className="w-full max-w-xl flex flex-col gap-6">

              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Prenom</label>
                  <input
                    type="text"
                    name="prenom_binome"
                    required
                    value={binome.prenom_binome}
                    onChange={handleBinomeChange}
                    className="bg-transparent border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
                    placeholder="Marie"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Nom</label>
                  <input
                    type="text"
                    name="nom_binome"
                    required
                    value={binome.nom_binome}
                    onChange={handleBinomeChange}
                    className="bg-transparent border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
                    placeholder="Dupont"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Email</label>
                <input
                  type="email"
                  name="email_binome"
                  required
                  value={binome.email_binome}
                  onChange={handleBinomeChange}
                  className="bg-transparent border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
                  placeholder="marie@email.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Telephone</label>
                <input
                  type="tel"
                  name="telephone_binome"
                  required
                  value={binome.telephone_binome}
                  onChange={handleBinomeChange}
                  className="bg-transparent border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
                  placeholder="+33 6 00 00 00 00"
                />
              </div>

              <div className="border border-white/5 p-6 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs tracking-[0.3em] text-white/40 uppercase">Inscription binome</span>
                  <span className="text-2xl font-black">890 EUR</span>
                </div>
                <p className="text-white/20 text-xs mt-2">18 au 20 Septembre 2026 — Pyrenees</p>
              </div>

              {erreur && (
                <p className="text-red-400 text-xs tracking-widest text-center">{erreur}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="border border-white/20 text-white text-xs tracking-[0.4em] uppercase px-10 py-4 hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-40"
              >
                {loading ? 'Redirection...' : 'Payer et finaliser ↘'}
              </button>

            </form>
          </>
        )}

      </div>
      <Footer />
    </main>
  )
}