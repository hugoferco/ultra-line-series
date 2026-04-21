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

export default function ModifierCompte() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [succes, setSucces] = useState('')
  const [erreur, setErreur] = useState('')
  const [formData, setFormData] = useState({
    prenom: '', nom: '', email: '', mot_de_passe: '', mot_de_passe_confirm: ''
  })

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setFormData({
        prenom: user.user_metadata?.prenom || '',
        nom: user.user_metadata?.nom || '',
        email: user.email || '',
        mot_de_passe: '',
        mot_de_passe_confirm: ''
      })
    }
    fetchUser()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErreur('')
    setSucces('')

    if (formData.mot_de_passe && formData.mot_de_passe !== formData.mot_de_passe_confirm) {
      setErreur('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    const updates = {
      data: {
        prenom: formData.prenom,
        nom: formData.nom,
      }
    }

    if (formData.email) updates.email = formData.email
    if (formData.mot_de_passe) updates.password = formData.mot_de_passe

    const { error } = await supabase.auth.updateUser(updates)

    if (error) {
      setErreur('Une erreur est survenue')
      setLoading(false)
      return
    }

    setSucces('Informations mises a jour avec succes')
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">

        <div className="w-full max-w-xl mb-12 text-center">
          <p className="text-xs tracking-[0.4em] text-white/40 uppercase mb-4">Ultra Line Series</p>
          <h1 className="text-3xl font-black uppercase leading-tight mb-4">
            Modifier<br /><span className="text-white/30">Mon compte.</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col gap-6">

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Prenom</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="bg-transparent border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Nom</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="bg-transparent border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-transparent border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
            />
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col gap-6">
            <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase">Changer le mot de passe (optionnel)</p>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Nouveau mot de passe</label>
              <input
                type="password"
                name="mot_de_passe"
                value={formData.mot_de_passe}
                onChange={handleChange}
                className="bg-transparent border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
                placeholder="Laisser vide pour ne pas changer"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Confirmer le mot de passe</label>
              <input
                type="password"
                name="mot_de_passe_confirm"
                value={formData.mot_de_passe_confirm}
                onChange={handleChange}
                className="bg-transparent border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-all placeholder:text-white/20"
                placeholder="Laisser vide pour ne pas changer"
              />
            </div>
          </div>

          {erreur && (
            <p className="text-red-400 text-xs tracking-widest text-center">{erreur}</p>
          )}

          {succes && (
            <p className="text-green-400 text-xs tracking-widest text-center">{succes}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="border border-white/20 text-white text-xs tracking-[0.4em] uppercase px-10 py-4 hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-40"
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder ↘'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/mon-espace')}
            className="text-xs tracking-[0.3em] text-white/20 uppercase hover:text-white/60 transition-all text-center"
          >
            Annuler
          </button>

        </form>
      </div>
      <Footer />
    </main>
  )
}