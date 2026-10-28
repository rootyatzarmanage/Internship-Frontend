const audiences = [
  { title: 'Owners & developers', description: 'Visibility across projects, costs, decisions and the asset record.' },
  { title: 'Architects & consultants', description: 'Shared information, coordinated models and traceable decisions.' },
  { title: 'Builders & PM teams', description: 'Current information, procurement, progress and project records.' },
  { title: 'Suppliers', description: 'Submit structured product information that stays with the asset.' },
  { title: 'Facility & asset teams', description: 'Start operations with equipment, manuals, warranties and records connected.' },
  { title: 'Government & investors', description: 'Better visibility into progress, decisions and project information.' },
]

export default function Stakeholders() {
  return (
    <section id="stakeholders" className="bg-[#0a0a0a] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-24 2xl:px-0">
      <div className="mx-auto w-full max-w-[1600px]">
        <p className="mb-8 text-base uppercase tracking-wide text-[#08b5f5]">Built for the built environment</p>
        <h2 className="max-w-[1000px] text-5xl font-bold leading-[1.08] tracking-[-0.025] sm:text-6xl xl:text-[68px]">
          Everyone Works From <br className="hidden sm:block" />The Same <span className="text-[#08a9ed]">Records</span>.
        </h2>
        <p className="mt-8 max-w-[900px] text-xl leading-[1.65] text-white/90">
          Give each stakeholder the information they need without losing the connection to the wider asset lifecycle.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {audiences.map((audience) => (
            <article key={audience.title} className="min-h-[211px] rounded-lg border-[1.5px] border-[#525252] px-4 py-8">
              <h3 className="text-2xl font-semibold leading-tight sm:text-3xl xl:text-[38px]">{audience.title}</h3>
              <p className="mt-4 max-w-[460px] text-lg leading-[1.65] text-white/90 sm:mt-6 sm:text-xl">{audience.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}


