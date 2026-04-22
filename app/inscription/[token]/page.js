'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Inscription() {
  const { token } = useParams()
  const [loading, setLoading] = useState(false)
  const [tokenValide, setTokenValide] = useState(null)
  const [compteCreé, setCompteCreé] = useState(false)
  const [erreur, setErreur] = useState('')

  const [compte, setCompte] = useState({
    email: '', mot_de_passe: '', mot_de_passe_confirm: '', prenom: '', nom: ''
  })

  useEffect(() => {
    const verifierToken = async () => {
      const { data, error } = await supabase
        .from('candidatures')
        .select('id, selectionne')
        .eq('token', token)
        .eq('selectionne', true)
        .single()

      setTokenValide(!error && !!data)
    }

    verifierToken()
  }, [token])

  const handleCompteChange = (e) => {
    setCompte({ ...compte, [e.target.name]: e.target.value })
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

    setCompteCreé(true)
    setLoading(false)
  }

  if (tokenValide === null) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/30 text-xs tracking-widest uppercase">Vérification...</p>
      </main>
    )
  }

  if (tokenValide === false) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-8 text-center">
        <p className="text-xs tracking-[0.4em] text-white/40 uppercase mb-6">Lien invalide</p>
        <h1 className="text-3xl font-black uppercase mb-4">
          Ce lien<br /><span className="text-white/30">n'est pas valide.</span>
        </h1>
        <p className="text-white/30 text-sm tracking-widest max-w-sm">
          Ce lien d'invitation est expiré ou incorrect. Contactez l'équipe ULS si vous pensez que c'est une erreur.
        </p>
      </main>
    )
  }

  if (compteCreé) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-8 text-center">
        <p className="text-xs tracking-[0.4em] text-white/40 uppercase mb-6">Compte créé</p>
        <h1 className="text-4xl md:text-5xl font-black uppercase leading-tight mb-6">
          Bienvenue<br /><span className="text-white/30">dans l'équipe.</span>
        </h1>
        <p className="text-white/40 text-sm tracking-widest max-w-md mb-12">
          Votre compte a été créé. Connectez-vous pour accéder à votre espace binôme et finaliser votre inscription.
        </p>
        <Link
          href="/login"
          className="border border-white/20 text-white text-xs tracking-[0.4em] uppercase px-10 py-4 hover:bg-white hover:text-black transition-all duration-300"
        >
          Se connecter ↘
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">

        <div className="w-full max-w-xl mb-12 text-center">
          <p className="text-xs tracking-[0.4em] text-white/40 uppercase mb-4">Ultra Line Series — Édition 00</p>
          <h1 className="text-3xl md:text-5xl font-black uppercase leading-tight mb-4">
            Créer<br /><span className="text-white/30">mon compte.</span>
          </h1>
          <p className="text-white/30 text-xs tracking-widest">
            Créez votre espace personnel pour accéder à votre dossier et finaliser votre inscription.
          </p>
        </div>

        <form onSubmit={handleCreerCompte} className="w-full max-w-xl flex flex-col gap-6">

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Prénom</label>
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
              placeholder="8 caractères minimum"
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
              placeholder="8 caractères minimum"
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
            {loading ? 'Création...' : 'Créer mon compte ↘'}
          </button>

        </form>
      </div>
      <Footer />
    </main>
  )
}
