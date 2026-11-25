import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import logo from '../../assets/logo.png'

const sectionLinks = [
  { label: 'Platform', hash: 'platform' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const showLoginAction = pathname !== '/login' && pathname !== '/signup'

  return (
    <header className="sticky top-0 z-30 bg-[#171717] text-white">
      <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between px-4">
        <Link to="/" hash="top" aria-label="Yatzar Manage home" className="flex shrink-0 items-center">
          <img src={logo} alt="" aria-hidden="true" className="h-auto w-[clamp(130px,13.37vw,240px)] max-w-full object-contain" />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-6 text-[clamp(14px,1.25vw,18px)] text-white/90 lg:flex xl:gap-8">
          {sectionLinks.map((link) => <Link key={link.label} to="/" hash={link.hash} className="whitespace-nowrap transition hover:text-[#08a9ed]">{link.label}</Link>)}
          <Link to="/pricing" className="whitespace-nowrap transition hover:text-[#08a9ed]">Pricing</Link>
          <Link to="/contact" className="whitespace-nowrap transition hover:text-[#08a9ed]">Contact</Link>
          <Link to="/book-a-demo" onClick={() => setMenuOpen(false)} className="py-1 text-white/90 hover:text-[#08a9ed]">Book a Demo</Link>
        </nav>

        <div className="hidden items-center gap-2 lg:flex xl:gap-3">
          {showLoginAction && <Link to="/login" className="h-10 rounded-md border border-white px-3 py-2 text-sm transition hover:bg-white/10 xl:px-4 xl:text-base">Login / Sign-Up</Link>}
        </div>

        <button type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="rounded p-2 hover:bg-white/10 hover:cursor-pointer lg:hidden">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
        </button>
      </div>
      {menuOpen && <nav aria-label="Mobile navigation" className="border-t border-white/10 px-5 py-3 lg:hidden">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 text-sm">
          {sectionLinks.map((link) => <Link key={link.label} to="/" hash={link.hash} onClick={() => setMenuOpen(false)} className="py-1 text-white/90 hover:text-[#08a9ed]">{link.label}</Link>)}
          <Link to="/pricing" onClick={() => setMenuOpen(false)} className="py-1 text-white/90 hover:text-[#08a9ed]">Pricing</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="py-1 text-white/90 hover:text-[#08a9ed]">Contact</Link>
          <Link to="/book-a-demo" onClick={() => setMenuOpen(false)} className="py-1 text-white/90 hover:text-[#08a9ed]">Book a Demo</Link>
          {showLoginAction && <Link to="/login" onClick={() => setMenuOpen(false)} className="py-1 text-white/90 hover:text-[#08a9ed]">Login / Sign-Up</Link>}
        </div>
      </nav>}
    </header>
  )
}
