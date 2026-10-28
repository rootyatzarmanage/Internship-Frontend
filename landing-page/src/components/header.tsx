import { useState } from 'react'
import logo from '../assets/logo.png'

const links = [
  { label: 'Platform', href: '#platform' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Why Yatzar', href: '#why-yatzar' },
  { label: 'Pricing', href: '#pricing' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black text-white">
      <div className="mx-auto flex h-[78px] max-w-[1600px] items-center justify-between px-5 md:px-0">
        <a href="#top" aria-label="Yatzar Manage home" className="flex shrink-0 items-center gap-3 text-[19px] font-medium tracking-wide">
          <img src={logo} alt="" aria-hidden="true" className="h-6 w-8 object-contain brightness-0 invert" />
          <span>YATZAR MANAGE</span>
        </a>

        <nav aria-label="Main navigation" className="hidden items-center gap-7 text-[18px] text-white/90 lg:flex">
          {links.map((link) => <a key={link.label} href={link.href} className="transition hover:text-[#08a9ed] text-xl">{link.label}</a>)}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <a href="#book-demo" className="flex h-10 items-center gap-4 rounded-md bg-[#00A6F4] px-4 text-base text-white transition hover:bg-[#0095dc]">Book a demo <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none"><path d="M3 8h9m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
          <a href="#login" className="h-10 rounded-md border border-white px-4 py-2 text-base transition hover:bg-white/10">Login / Sign-up</a>
        </div>

        <button type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="rounded p-2 hover:bg-white/10 hover:cursor-pointer lg:hidden">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
        </button>
      </div>
      {menuOpen && <nav aria-label="Mobile navigation" className="border-t border-white/10 px-5 py-3 lg:hidden">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 text-sm">
          {links.map((link) => <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className="py-1 text-white/90 hover:text-[#08a9ed]">{link.label}</a>)}
          <a href="#book-demo" onClick={() => setMenuOpen(false)} className="mt-1 text-[#08a9ed]">Book a demo <svg aria-hidden="true" viewBox="0 0 16 16" className="inline h-3 w-3 text-xs" fill="none"><path d="M3 8h9m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
        </div>
      </nav>}
    </header>
  )
}
