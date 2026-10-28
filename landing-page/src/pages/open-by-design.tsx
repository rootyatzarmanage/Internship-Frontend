const principles = [
  { title: 'openBIM workflow', description: 'Data moves in IFC, BCF, IDS and COBie.' },
  { title: 'ISO 19650', description: 'Project and asset information organised around defined requirements and lifecycle stages.' },
  { title: 'Built for India', description: 'Designed with Indian project, procurement and commercial workflows in mind.' },
]

const standards = ['ISO 19650', 'IFC 4.3', 'BCF', 'IDS', 'COBie', 'openBIM']

export default function OpenByDesign() {
  return (
    <section id="open-by-design" className="scroll-mt-[78px] bg-[#171717] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-24 2xl:px-0">
      <div className="mx-auto w-full max-w-[1600px]">
        <p className="mb-8 text-base uppercase tracking-wide text-[#08b5f5]">Open by design</p>
        <h2 className="max-w-[1000px] text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl xl:text-[68px]">
          Built around information,<br className="hidden sm:block" /> not <span className="text-[#08a9ed]">lock-in</span>.
        </h2>

        <div className="mt-16">
          {principles.map((principle, index) => (
            <article key={principle.title} className={`grid grid-cols-1 items-center gap-3 py-7 md:grid-cols-[0.8fr_1.2fr] md:gap-8 ${index < principles.length - 1 ? 'border-b border-[#525252]' : ''}`}>
              <h3 className="text-2xl font-semibold sm:text-[32px]">{principle.title}</h3>
              <p className="text-base leading-[1.65] text-white/90 sm:text-lg md:text-right">{principle.description}</p>
            </article>
          ))}
        </div>

        <ul aria-label="Supported standards" className="mt-14 flex flex-wrap gap-5">
          {standards.map((standard) => (
            <li key={standard} className="rounded-lg border border-[#00a6f4] px-4 py-2 text-base text-[#00a6f4]">{standard}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

