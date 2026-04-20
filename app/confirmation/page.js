import Link from 'next/link'

export default function Confirmation() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-8 text-center">
      <p className="text-xs tracking-[0.4em] text-white/40 uppercase mb-6">Inscription confirmee</p>
      <h1 className="text-4xl md:text-6xl font-black uppercase leading-tight mb-6">
        C'est officiel.<br />
        <span className="text-white/30">A bientot.</span>
      </h1>
      <p className="text-white/40 text-sm tracking-widest max-w-md mb-12">
        Votre inscription est confirmee. Vous recevrez toutes les informations pratiques par email avant le depart.
      </p>
      <div className="flex flex-col gap-4 items-center">
        <p className="text-white/20 text-xs tracking-widest uppercase">18 — 20 Septembre 2026</p>
        <p className="text-white/20 text-xs tracking-widest uppercase">Pyrenees — Edition 00</p>
      </div>
    </main>
  )
}