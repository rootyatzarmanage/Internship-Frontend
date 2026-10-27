import infinite from '../assets/Infinity animation 1.gif'

export default function Hero() {
  return (
    <>
      <section id="top" className="flex min-h-[calc(100vh-120px)] items-center bg-black text-white">
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 items-center gap-14 px-5 py-20 md:px-0 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:py-24">
          <div>
            <p className="mb-8 text-base uppercase tracking-wide text-[#08b5f5]">Digital project and asset management</p>
            <h1 className="max-w-[850px] text-[76px] font-bold leading-[1.14] tracking-tight">One connected record<br className="hidden sm:block" /> for every <span className="text-[#08a9ed]">project</span> and<br className="hidden sm:block" /> every <span className="text-[#08a9ed]">asset</span>.</h1>
            <p className="mt-8 max-w-[850px] text-base leading-[1.65] text-white/80 text-xl">Yatzar Manage connects the information created during design and construction with the asset records needed for operation, maintenance and renewal.</p>
            <div className="mt-8 flex flex-wrap gap-7">
              <a href="#book-demo" className="rounded-md bg-[#08a9ed] px-8 py-4 text-xl transition hover:bg-[#0797d3]">Book a demo</a>
              <a href="#how-it-works" className="rounded-md border border-white/60 px-8 py-4 text-xl transition hover:bg-white/10">See the lifecycle</a>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[600px]" aria-label="Information from project to asset management">
            <div className="mx-auto h-[280px] w-full max-w-[600px]" aria-label="Infinity animation">
              <img src={infinite} alt="" className="h-full w-full object-contain" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}


