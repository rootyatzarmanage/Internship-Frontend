import logo from '../assets/logo.png'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Lifecycle', href: '/#eight-stages' },
      { label: 'Platform', href: '/#platform' },
      { label: 'FAQ', href: '/#faq' },
      { label: 'Contact', href: '/contact' },
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
      { label: 'Sign Up', href: '#' },
      { label: 'Book a Demo', href: '/book-a-demo' },
    ],
  },
]

const legal = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Use', href: '#' },
  { label: 'Refund Policy', href: '#' },
]

const linkClass =
  'text-base leading-7 text-white transition-colors duration-200 hover:text-[#00aeef] focus-visible:text-[#00aeef] focus-visible:outline-none break-words xl:text-lg 2xl:text-xl'

const headingClass =
  'text-sm font-normal uppercase tracking-[0.02em] text-[#00aeef] xl:text-base'

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

export default function Footer({ backgroundClass = 'bg-black' }: { backgroundClass?: string }) {
  return (
    <footer className={`w-full ${backgroundClass} px-5 pb-10 pt-10 text-white sm:px-8 lg:px-12 2xl:px-0`}>
      <div className="mx-auto w-full max-w-[1600px]">
        {/* Top: brand + link columns (stacked until xl) */}
        <div className="grid grid-cols-1 gap-y-10 sm:gap-y-12 xl:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.7fr)] xl:items-start xl:gap-x-12">
          {/* Brand */}
          <div className="min-w-0">
            <a href="/" className="inline-flex items-center gap-2" aria-label="Yatzar Manage home">
              <img
                src={logo}
                alt="Yatzar Manage"
                className="h-auto w-[140px] max-w-full object-contain sm:w-[160px] xl:w-[180px]"
              />
            </a>
            <p className="mt-4 max-w-[400px] text-base leading-7 text-white/90 xl:text-lg xl:leading-8 2xl:text-xl 2xl:leading-[34px]">
              Digital project and asset management for the built environment.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid min-w-0 grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 xl:ml-auto xl:w-full xl:max-w-[900px] xl:grid-cols-[1fr_1fr_1fr_1.5fr] xl:gap-x-10">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title} className="min-w-0">
                <h3 className={headingClass}>{col.title}</h3>
                <ul className="mt-4 flex flex-col gap-3 sm:mt-5 sm:gap-4">
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
            <div className="col-span-2 min-w-0 md:col-span-3 xl:col-span-1">
              <h3 className={headingClass}>Social media</h3>
              <ul className="mt-4 flex flex-col gap-3 sm:mt-5 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-4 xl:flex-col xl:gap-4">
                <li>
                  <a
                    href="https://www.instagram.com/yatzar_creations"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${linkClass} flex items-center gap-3 whitespace-nowrap`}
                  >
                    <InstagramIcon />
                    <span className="leading-7">yatzar_creations</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/yatzar-creations-private-limited"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${linkClass} flex items-center gap-3 whitespace-nowrap`}
                  >
                    <LinkedInIcon />
                    <span className="leading-7">Yatzar Creations</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 h-px w-full bg-white/25 xl:mt-[50px]" />

        {/* Bottom bar (stacked until lg) */}
        <div className="mt-8 flex flex-col items-start gap-5 lg:mt-10 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <p className="max-w-[900px] text-sm leading-6 text-white/90 sm:text-base sm:leading-7 xl:text-lg 2xl:text-xl 2xl:leading-[34px]">
            © 2026 Yatzar Creations Private Limited. Incubated at PSG-STEP, PSG College of
            Technology, Coimbatore.
          </p>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 max-[450px]:flex-col max-[450px]:items-start lg:shrink-0">
            {legal.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-sm text-white underline underline-offset-4 transition-colors duration-200 hover:text-[#00aeef] focus-visible:text-[#00aeef] focus-visible:outline-none sm:text-base xl:text-lg 2xl:text-xl"
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
