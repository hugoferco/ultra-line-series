'use client'

import { useEffect, useState } from 'react'

export default function AnimatedTitle() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="max-w-2xl overflow-hidden">
      <p
        className="text-xs tracking-[0.4em] text-white/40 uppercase mb-4 transition-all duration-700 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transitionDelay: '0ms',
        }}
      >
        The Ultimate Outdoor Challenge
      </p>
      <h1 className="text-4xl md:text-6xl font-black uppercase leading-tight tracking-tight">
        <span
          className="block transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '150ms',
          }}
        >
          Push Further.
        </span>
        <span
          className="block text-white/30 transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '300ms',
          }}
        >
          Together.
        </span>
      </h1>
    </div>
  )
}
