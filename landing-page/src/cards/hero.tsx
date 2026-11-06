import { Link } from '@tanstack/react-router'
import infinite from '../assets/Infinity animation 1.gif'

export default function Hero() {
  return (
    <section
      id="top"
      className="flex min-h-[calc(100vh-120px)] items-center overflow-hidden bg-black text-white"
    >
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 items-center gap-8 px-5 py-12 sm:gap-12 sm:px-6 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:px-5 lg:py-24 2xl:px-0">

        {/* Hero Content */}
        <div className="landing-hero-copy min-w-0">
          <p className="mb-5 text-sm uppercase tracking-wide text-[#08b5f5] sm:mb-8 sm:text-base">
            Digital project and asset management
          </p>

          <h1 className="max-w-[850px] text-[28px] font-bold leading-[1.15] tracking-tight min-[375px]:text-3xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[66px]">
            One connected record
            <br />
            <span className="normal-case">for</span> every{' '}
            <span className="text-[#08a9ed]">project</span>{' '}
            <span className="normal-case">and</span>
            <br />
            every <span className="text-[#08a9ed]">asset</span>
            <br />
            Powered <span className="normal-case">by</span>{' '}
            <span className="text-[#08a9ed]">AI.</span>
          </h1>

          <p className="mt-5 max-w-[850px] text-base leading-relaxed text-white/80 sm:mt-8 sm:text-lg lg:text-xl">
            Yatzar Manage connects the information created during design and construction with the asset records needed for operation, maintenance and renewal.
          </p>

          <div className="mt-7 flex flex-wrap gap-3 min-[375px]:gap-4 sm:mt-8 sm:gap-5">
            <Link
              to="/book-a-demo"
              className="rounded-md bg-[#08a9ed] px-5 py-3 text-sm transition hover:bg-[#0797d3] sm:px-8 sm:py-4 sm:text-lg"
            >
              Book a Demo
            </Link>

            <a
              href="#eight-stages"
              className="rounded-md border border-white/60 px-5 py-3 text-sm transition hover:bg-white/10 sm:px-8 sm:py-4 sm:text-lg"
            >
              See the Lifecycle
            </a>
          </div>
        </div>

        {/* Infinity Animation */}
        <div
          className="landing-hero-visual mx-auto w-full max-w-[600px] lg:ml-auto"
          aria-label="Information from project to asset management"
        >
          <div className="h-[150px] w-full sm:h-[220px] md:h-[280px] lg:h-[280px]">
            <img
              src={infinite}
              alt=""
              className="h-full w-full object-contain lg:translate-x-18"
            />
          </div>
        </div>

      </div>
    </section>
  )
}