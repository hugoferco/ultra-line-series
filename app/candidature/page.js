'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Candidature() {
  const [formData, setFormData] = useState({
    nom: '', prenom: '', adresse: '', telephone: '',
    prenom_binome: '', nom_binome: '', email_binome: '', telephone_binome: '',
    motivation: ''
  })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('candidatures').insert([formData])
    if (error) {
      setStatus('error')
    } else {
      setStatus('success')
    }
    setLoading(false)
  }

  if (status === 'success') {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-8 text-center">
        <p className="text-xs tracking-[0.4em] text-white/40 uppercase mb-6">Candidature reçue</p>
        <h1 className="text-4xl md:text-6xl font-black uppercase leading-tight mb-6">
          À bientôt<br /><span className="text-white/30">peut-être.</span>
        </h1>
        <p className="text-white/40 text-sm tracking-widest max-w-md mb-12">
          Votre candidature a été transmise. Si vous êtes sélectionné, vous recevrez une lettre.
        </p>
        <Link href="/" className="text-xs tracking-[0.4em] text-white/30 uppercase hover:text-white transition-all">
          ← Retour
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-8 py-16">

      {/* Header */}
      <div className="w-full max-w-xl mb-12 text-center">
        <p className="text-xs tracking-[0.4em] text-white/40 uppercase mb-4">Ultra Line Series — Édition 00</p>
        <h1 className="text-3xl md:text-5xl font-black uppercase leading-tight mb-4">
          Postuler à<br /><span className="text-white/30">l'expérience.</span>
        </h1>
        <p className="text-white/30 text-xs tracking-widest">
          Les candidatures sont examinées par l'équipe ULS. Seuls les profils sélectionnés seront contactés.
        </p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col gap-8">

        {/* Participant 1 */}
        <div className="flex flex-col gap-6">
          <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase border-b border-white/10 pb-3">
            Participant 1 — Vous
          </p>

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Prénom</label>
              <input
                type="text"
                name="prenom"
                required
                value={formData.prenom}
                onChange={handleChange}
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
                value={formData.nom}
                onChange={handleChange}
                className="bg-transparent border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
                placeholder="Dupont"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Adresse</label>
            <input
              type="text"
              name="adresse"
              required
              value={formData.adresse}
              onChange={handleChange}
              className="bg-transparent border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
              placeholder="12 rue de la Montagne, 75001 Paris"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Téléphone</label>
            <input
              type="tel"
              name="telephone"
              required
              value={formData.telephone}
              onChange={handleChange}
              className="bg-transparent border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
              placeholder="+33 6 00 00 00 00"
            />
          </div>
        </div>

        {/* Participant 2 */}
        <div className="flex flex-col gap-6">
          <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase border-b border-white/10 pb-3">
            Participant 2 — Binôme
          </p>

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Prénom</label>
              <input
                type="text"
                name="prenom_binome"
                required
                value={formData.prenom_binome}
                onChange={handleChange}
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
                value={formData.nom_binome}
                onChange={handleChange}
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
              value={formData.email_binome}
              onChange={handleChange}
              className="bg-transparent border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
              placeholder="marie@email.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Téléphone</label>
            <input
              type="tel"
              name="telephone_binome"
              required
              value={formData.telephone_binome}
              onChange={handleChange}
              className="bg-transparent border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
              placeholder="+33 6 00 00 00 00"
            />
          </div>
        </div>

        {/* Motivation */}
        <div className="flex flex-col gap-6">
          <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase border-b border-white/10 pb-3">
            Votre candidature
          </p>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Parcours sportif & motivation</label>
            <textarea
              name="motivation"
              required
              rows={6}
              value={formData.motivation}
              onChange={handleChange}
              className="bg-transparent border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20 resize-none"
              placeholder="Décrivez votre parcours sportif, vos expériences en course, et pourquoi vous souhaitez vivre l'expérience ULS..."
            />
          </div>
        </div>

        {status === 'error' && (
          <p className="text-red-400 text-xs tracking-widest text-center">
            Une erreur est survenue. Réessayez.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="border border-white/20 text-white text-xs tracking-[0.4em] uppercase px-10 py-4 hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-40"
        >
          {loading ? 'Envoi en cours...' : 'Soumettre ma candidature ↘'}
        </button>

      </form>

      <Link href="/" className="mt-12 text-xs tracking-[0.4em] text-white/20 uppercase hover:text-white/60 transition-all">
        ← Retour
      </Link>

    </main>
  )
}
