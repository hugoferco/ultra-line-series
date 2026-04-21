'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', mot_de_passe: '' })
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErreur('')

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.mot_de_passe,
    })

    if (error) {
      setErreur('Email ou mot de passe incorrect')
      setLoading(false)
      return
    }

    router.push('/mon-espace')
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-8">
      
      <div className="w-full max-w-xs mb-12 text-center">
        <p className="text-xs tracking-[0.4em] text-white/40 uppercase mb-4">Ultra Line Series</p>
        <h1 className="text-3xl font-black uppercase leading-tight mb-4">
          Mon<br /><span className="text-white/30">Espace.</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-6">

        <div className="flex flex-col gap-2">
          <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
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
            value={formData.mot_de_passe}
            onChange={handleChange}
            className="bg-transparent border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
            placeholder="••••••••"
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
          {loading ? 'Connexion...' : 'Se connecter ↘'}
        </button>

      </form>

    </main>
  )
}