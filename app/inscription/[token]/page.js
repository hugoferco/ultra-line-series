'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Inscription() {
  const { token } = useParams()
  const [formData, setFormData] = useState({
    nom_binome: '', prenom_binome: '', email_binome: '', telephone_binome: ''
  })
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErreur(false)

    const { data: candidature } = await supabase
      .from('candidatures')
      .select('id')
      .eq('token', token)
      .single()

    if (!candidature) {
      setErreur(true)
      setLoading(false)
      return
    }

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        token,
        candidature_id: candidature.id,
      }),
    })

    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-8 py-16">

      <div className="w-full max-w-xl mb-12 text-center">
        <p className="text-xs tracking-[0.4em] text-white/40 uppercase mb-4">Ultra Line Series — Edition 00</p>
        <h1 className="text-3xl md:text-5xl font-black uppercase leading-tight mb-4">
          Votre<br /><span className="text-white/30">Binome.</span>
        </h1>
        <p className="text-white/30 text-xs tracking-widest">
          Renseignez les informations de votre partenaire pour finaliser l'inscription.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col gap-6">

        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Prenom</label>
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
          <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Telephone</label>
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

        <div className="border border-white/5 p-6 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-xs tracking-[0.3em] text-white/40 uppercase">Inscription binome</span>
            <span className="text-2xl font-black">890 €</span>
          </div>
          <p className="text-white/20 text-xs mt-2">18 au 20 Septembre 2026 — Pyrenees</p>
        </div>

        {erreur && (
          <p className="text-red-400 text-xs tracking-widest text-center">
            Une erreur est survenue. Reessayez.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="border border-white/20 text-white text-xs tracking-[0.4em] uppercase px-10 py-4 hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-40"
        >
          {loading ? 'Redirection...' : 'Payer et finaliser ↘'}
        </button>

      </form>

    </main>
  )
}