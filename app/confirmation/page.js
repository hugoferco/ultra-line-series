import Link from 'next/link'

export default function Confirmation() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-8 text-center">
      <p className="text-xs tracking-[0.4em] text-white/40 uppercase mb-6">Paiement confirmé</p>
      <h1 className="text-4xl md:text-6xl font-black uppercase leading-tight mb-6">
        C'est officiel.<br />
        <span className="text-white/30">À bientôt.</span>
      </h1>
      <p className="text-white/40 text-sm tracking-widest max-w-md mb-12">
        Votre inscription est confirmée. Vous recevrez toutes les informations pratiques par email avant le départ.
      </p>

      <div className="flex flex-col gap-3 items-center mb-16">
        <p className="text-white/20 text-xs tracking-widest uppercase">18 — 20 Septembre 2026</p>
        <p className="text-white/20 text-xs tracking-widest uppercase">Pyrénées — Édition 00</p>
      </div>

      <div className="border border-white/10 p-8 max-w-md w-full text-left">
        <p className="text-xs tracking-[0.4em] text-white/40 uppercase mb-3">Votre espace personnel</p>
        <p className="text-white/50 text-sm mb-6">
          Consultez votre dossier, renseignez vos codes PPS et suivez l'état de votre inscription depuis votre espace binôme.
        </p>
        <Link
          href="/mon-espace"
          className="block border border-white/20 text-white text-xs tracking-[0.4em] uppercase px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 text-center"
        >
          Accéder à mon espace ↘
        </Link>
        <p className="text-white/20 text-xs text-center mt-4">
          Accessible à tout moment via{' '}
          <Link href="/login" className="hover:text-white/60 underline transition-all">
            /login
          </Link>
        </p>
      </div>
    </main>
  )
}
