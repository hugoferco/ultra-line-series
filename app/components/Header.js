import Link from 'next/link'

export default function Header() {
  return (
    <header className="w-full flex justify-between items-center px-8 py-6">
      <Link href="/">
        <img src="/logos/ULS_2026_horizontal_blanc.png" alt="Ultra Line Series" className="h-6" />
      </Link>
      <Link href="/login" className="text-xs tracking-[0.3em] text-white/40 uppercase hover:text-white transition-all">
        Mon compte
      </Link>
    </header>
  )
}