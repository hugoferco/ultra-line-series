import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
      <span className="text-xs tracking-[0.2em] text-white/20 uppercase">Ultra Line Series — Edition 00</span>
      <div className="flex gap-8">
        <Link href="/cgv" className="text-xs tracking-[0.2em] text-white/20 uppercase hover:text-white/60 transition-all">
          CGV
        </Link>
        <Link href="/mentions-legales" className="text-xs tracking-[0.2em] text-white/20 uppercase hover:text-white/60 transition-all">
          Mentions legales
        </Link>
      </div>
    </footer>
  )
}