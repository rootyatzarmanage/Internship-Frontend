import dashboardImage from '../assets/dashboard.png'

const platformFeatures = [
  { title: 'Project management', text: 'Workspaces, projects, tasks, approvals and progress.' },
  { title: 'Information management', text: 'Documents, decisions, revisions and audit trails.' },
  { title: 'BIM & open BIM', text: 'Connect models and structured information to project and asset records.' },
  { title: 'Procurement & commercial', text: 'Bring quantities, procurement and project financial records together.' },
  { title: 'Asset management', text: 'Carry equipment, manuals, warranties and work orders into operation.' },
]

export default function Platform() {
  return (
    <section id="platform" className="scroll-mt-[78px] bg-black px-5 py-20 text-white md:px-10 lg:py-24">
      <div className="mx-auto grid w-[84%] max-w-[1600px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <div>
          <p className="mb-8 text-base uppercase tracking-wide text-[#08b5f5]">The platform</p>
          <h2 className="max-w-[700px] text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl xl:text-[68px]">
            One login. One<br className="hidden sm:block" /> connected <span className="text-[#08a9ed]">record</span>.
          </h2>

          <div className="mt-8">
            {platformFeatures.map((feature, index) => (
              <article key={feature.title} className={`py-6 max-w-[500px] ${index < platformFeatures.length - 1 ? 'border-b border-white/25' : ''}`}>
                <p className="text-xl leading-7 sm:text-lg">
                  <strong className="font-semibold text-[#08a9ed]">{feature.title} - </strong>
                  <span className="text-white/90">{feature.text}</span>
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl">
          <img src={dashboardImage} alt="Yatzar Manage dashboard showing workspaces, projects, and a project map" className="block h-auto w-full object-cover" />
        </div>
      </div>
    </section>
  )
}
