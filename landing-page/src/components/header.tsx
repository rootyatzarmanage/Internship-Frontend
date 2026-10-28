import { useState } from 'react'
import logo from '../assets/logo.png'

const links = [
  { label: 'Platform', href: '#platform' },
  { label: 'How it Works', href: '#eight-stages' },
  { label: 'Why Yatzar', href: '#why-yatzar' },
  { label: 'Pricing', href: '#pricing' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black text-white">
      <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between px-4 sm:h-[78px] sm:px-5 2xl:px-0">
        <a href="#top" aria-label="Yatzar Manage home" className="flex shrink-0 items-center">
          <img src={logo} alt="" aria-hidden="true" className="h-auto w-[150px] max-w-full object-contain sm:w-[160px] lg:w-[180px]" />
        </a>

        <nav aria-label="Main navigation" className="hidden items-center gap-4 text-base text-white/90 lg:flex xl:gap-7 xl:text-lg">
          {links.map((link) => <a key={link.label} href={link.href} className="transition hover:text-[#08a9ed] xl:text-xl">{link.label}</a>)}
        </nav>

        <div className="hidden items-center gap-2 lg:flex xl:gap-3">
          <a href="#book-demo" className="flex h-10 items-center gap-2 rounded-md bg-[#00A6F4] px-3 text-sm text-white transition hover:bg-[#0095dc] xl:gap-4 xl:px-4 xl:text-base">Book a Demo <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none"><path d="M3 8h9m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
          <a href="#login" className="h-10 rounded-md border border-white px-3 py-2 text-sm transition hover:bg-white/10 xl:px-4 xl:text-base">Login / Sign-Up</a>
        </div>

        <button type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="rounded p-2 hover:bg-white/10 hover:cursor-pointer lg:hidden">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
        </button>
      </div>
      {menuOpen && <nav aria-label="Mobile navigation" className="border-t border-white/10 px-5 py-3 lg:hidden">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 text-sm">
          {links.map((link) => <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className="py-1 text-white/90 hover:text-[#08a9ed]">{link.label}</a>)}
          <a href="#book-demo" onClick={() => setMenuOpen(false)} className="mt-1 text-[#08a9ed]">Book a Demo <svg aria-hidden="true" viewBox="0 0 16 16" className="inline h-3 w-3 text-xs" fill="none"><path d="M3 8h9m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
          <a href="#login" onClick={() => setMenuOpen(false)} className="py-1 text-white/90 hover:text-[#08a9ed]">Login / Sign-Up</a>
        </div>
      </nav>}
    </header>
  )
}
