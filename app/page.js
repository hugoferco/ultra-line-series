import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-between relative overflow-hidden">
      
      {/* Grain overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-10"
        style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat', backgroundSize: '128px 128px'}}
      />

      {/* Header */}
      <header className="w-full flex justify-between items-center px-8 py-6 z-20">
        <span className="text-xs tracking-[0.3em] text-white/40 uppercase font-light">Edition 00</span>
        <span className="text-xs tracking-[0.3em] text-white/40 uppercase font-light">2026</span>
      </header>

      {/* Center content */}
      <div className="flex flex-col items-center justify-center flex-1 z-20 px-8 text-center gap-12">
        
        {/* Logo */}
        <div className="w-64 md:w-80">
          <img 
            src="/logos/ULS_2026_blanc.png" 
            alt="Ultra Line Series"
            className="w-full"
          />
        </div>

        {/* Phrase inspirante */}
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.4em] text-white/40 uppercase mb-4">The Ultimate Outdoor Challenge</p>
          <h1 className="text-4xl md:text-6xl font-black uppercase leading-tight tracking-tight">
            Push Further.<br />
            <span className="text-white/30">Together.</span>
          </h1>
        </div>

        {/* 3 éléments contextuels mystérieux */}
        <div className="flex gap-12 md:gap-24 mt-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.3em] text-white/30 uppercase">Lieu</span>
            <span className="text-sm tracking-[0.2em] text-white/70 uppercase font-bold">Pyrénées</span>
          </div>
          <div className="w-px bg-white/10" />
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.3em] text-white/30 uppercase">Format</span>
            <span className="text-sm tracking-[0.2em] text-white/70 uppercase font-bold">3 Jours · Duo</span>
          </div>
          <div className="w-px bg-white/10" />
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.3em] text-white/30 uppercase">Édition</span>
            <span className="text-sm tracking-[0.2em] text-white/70 uppercase font-bold">00 · 2026</span>
          </div>
        </div>

        {/* CTA */}
        <Link 
          href="/candidature"
          className="mt-8 border border-white/20 text-white text-xs tracking-[0.4em] uppercase px-10 py-4 hover:bg-white hover:text-black transition-all duration-300"
        >
          Postuler à l'expérience ↘
        </Link>

      </div>

      {/* Footer */}
      <footer className="w-full flex justify-between items-center px-8 py-6 z-20 border-t border-white/5">
        <span className="text-xs tracking-[0.2em] text-white/20 uppercase">ultralineseries.com</span>
        <span className="text-xs tracking-[0.2em] text-white/20 uppercase">@ultralineseries</span>
      </footer>

    </main>
  )
}