import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function AccessPage({ params }) {
  const { token } = await params

  const { data, error } = await supabase
    .from('candidatures')
    .select('*')
    .eq('token', token)
    .eq('selectionne', true)
    .single()

  if (error || !data) {
    redirect('/')
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-8 py-16">

      <div className="w-full max-w-2xl mb-16 text-center">
        <p className="text-xs tracking-[0.4em] text-white/40 uppercase mb-4">
          Acces confidentiel — Edition 00
        </p>
        <h1 className="text-4xl md:text-6xl font-black uppercase leading-tight mb-6">
          Bienvenue<br />
          <span className="text-white/30">{data.prenom}.</span>
        </h1>
        <p className="text-white/40 text-sm tracking-widest max-w-md mx-auto">
          Vous avez ete selectionne pour vivre l'experience Ultra Line Series.
          Voici toutes les informations pour preparer votre aventure.
        </p>
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-8 mb-16">

        <div className="border border-white/10 p-8">
          <p className="text-xs tracking-[0.4em] text-white/30 uppercase mb-6">Le format</p>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-xs tracking-[0.3em] text-white/40 uppercase">Day 01</span>
              <span className="text-sm text-white/70">Bike 63km / 2500D+ — Trail 17km / 900D+</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-xs tracking-[0.3em] text-white/40 uppercase">Day 02</span>
              <span className="text-sm text-white/70">Trail 50km / 3800D+</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs tracking-[0.3em] text-white/40 uppercase">Day 03</span>
              <span className="text-sm text-white/70">Bike 171km / 1700D+ — Kayak 10km — Trail 10km</span>
            </div>
          </div>
        </div>

        <div className="border border-white/10 p-8">
          <p className="text-xs tracking-[0.4em] text-white/30 uppercase mb-6">Les details</p>
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
              <span className="text-sm text-white/70">Duo — Sur invitation</span>
            </div>
          </div>
        </div>

      </div>

      <div className="w-full max-w-2xl text-center">
        <p className="text-white/30 text-xs tracking-widest mb-6">
          Inscrivez votre binome et finalisez votre inscription.
        </p>
        <Link
          href={`/inscription/${token}`}
          className="border border-white/20 text-white text-xs tracking-[0.4em] uppercase px-10 py-4 hover:bg-white hover:text-black transition-all duration-300"
        >
          Inscrire mon binome
        </Link>
      </div>

    </main>
  )
}