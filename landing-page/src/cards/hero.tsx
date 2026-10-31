import { Link } from '@tanstack/react-router'
import infinite from '../assets/Infinity animation 1.gif'

export default function Hero() {
  return (
    <>
      <section id="top" className="flex min-h-[calc(100vh-120px)] items-center bg-black text-white">
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 items-center gap-10 px-5 py-14 sm:gap-14 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-5 lg:py-24 2xl:px-0">
          <div className="landing-hero-copy">
            <p className="mb-8 text-base uppercase tracking-wide text-[#08b5f5]">Digital project and asset management</p>
            <h1 className="max-w-[850px] text-4xl font-bold leading-[1.14] tracking-tight sm:text-5xl lg:text-[70px]">One connected<br className="hidden sm:block" />record<br className="hidden sm:block" /> for every <span className="text-[#08a9ed]">project</span> and<br className="hidden sm:block" /> every <span className="text-[#08a9ed]">asset</span>.</h1>
            <p className="mt-6 max-w-[850px] text-lg leading-[1.65] text-white/80 sm:mt-8 sm:text-xl">Yatzar Manage connects the information created during design and construction with the asset records needed for operation, maintenance and renewal.</p>
            <div className="mt-7 flex flex-wrap gap-4 sm:mt-8 sm:gap-7">
              <Link to="/book-a-demo" className="rounded-md bg-[#08a9ed] px-6 py-3 text-lg transition hover:bg-[#0797d3] sm:px-8 sm:py-4 sm:text-xl">Book a Demo</Link>
              <a href="#how-it-works" className="rounded-md border border-white/60 px-6 py-3 text-lg transition hover:bg-white/10 sm:px-8 sm:py-4 sm:text-xl">See the Lifecycle</a>
            </div>
          </div>

          <div className="landing-hero-visual mx-auto w-full max-w-[600px]" aria-label="Information from project to asset management">
            <div className="mx-auto h-[180px] w-full max-w-[600px] sm:h-[280px]" aria-label="Infinity animation">
              <img src={infinite} alt="" className="h-full w-full object-contain" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}


