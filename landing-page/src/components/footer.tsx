import logo from '../assets/logo.png'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Lifecycle', href: '#lifecycle' },
      { label: 'Platform', href: '#platform' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  {
    title: 'Yatzar',
    links: [
      { label: 'Yatzar Creations', href: 'https://yatzarcreations.com/' },
      { label: 'Yatzar Academy', href: 'http://yatzaracademy.com/' },
      { label: 'Yatzar Asset', href: 'https://yatzarasset.com/' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Login', href: '#' },
      { label: 'Sign up', href: '#' },
      { label: 'Book a demo', href: '#cta' },
    ],
  },
]

const legal = [
  { label: 'Privacy policy', href: '#' },
  { label: 'Terms of use', href: '#' },
  { label: 'Refund policy', href: '#' },
]

const linkClass =
  'text-base leading-7 text-white transition-colors duration-200 hover:text-[#00aeef] focus-visible:text-[#00aeef] focus-visible:outline-none sm:text-lg lg:text-xl'

const headingClass =
  'text-sm font-normal uppercase tracking-[0.02em] text-[#00aeef] lg:text-base'

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="w-full bg-black px-5 pb-10 pt-10 text-white sm:px-8 lg:px-12 2xl:px-0">
      <div className="mx-auto w-full max-w-[1600px]">
        {/* Top: brand + link columns */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[555px_245px_316px_284px_1fr] lg:gap-x-0">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <a href="#" className="flex items-center gap-2" aria-label="Yatzar Manage home">
              <img src={logo} alt="" aria-hidden="true" className="h-7 w-9 object-contain brightness-0 invert" />
              <span className="text-2xl font-normal uppercase tracking-tight lg:text-[32px]">
                Yatzar Manage
              </span>
            </a>
            <p className="mt-4 max-w-[400px] text-base leading-7 text-white/90 lg:text-xl lg:leading-[34px]">
              Digital project and asset management for the built environment.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className={headingClass}>{col.title}</h3>
              <ul className="mt-5 flex flex-col gap-[22px]">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className={linkClass}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Social */}
          <div>
            <h3 className={headingClass}>Social media</h3>
            <ul className="mt-5 flex flex-col gap-[22px]">
              <li>
                <a
                  href="https://www.instagram.com/yatzar_creations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClass} flex items-center gap-3`}
                >
                  <InstagramIcon />
                  <span>yatzar_creations</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/yatzar-creations-private-limited"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClass} flex items-center gap-3`}
                >
                  <LinkedInIcon />
                  <span>Yatzar Creations</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 h-px w-full bg-white/25 lg:mt-[50px]" />

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-6 lg:mt-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <p className="max-w-[900px] text-xl leading-7 text-white/90 lg:text-xl lg:leading-[34px]">
            © 2026 Yatzar Creations Private Limited. Incubated at PSG-STEP, PSG College of
            Technology, Coimbatore.
          </p>

          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {legal.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-xl text-white underline underline-offset-4 transition-colors duration-200 hover:text-[#00aeef] focus-visible:text-[#00aeef] focus-visible:outline-none lg:text-xl"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
