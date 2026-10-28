const traditionalWorkflow = [
  'Project and asset information kept apart',
  'Handover as a file transfer',
  'Information recreated after completion',
  'Many tools and disconnected records',
]

const yatzarWorkflow = [
  'One connected project and asset record',
  'Handover as a lifecycle transition',
  'Information carried forward into operation',
  'openBIM oriented information workflows',
]

export default function WhyYatzar() {
  return (
    <section id="why-yatzar" className="scroll-mt-[78px] bg-[#171717] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-24 2xl:px-0">
      <div className="mx-auto w-full max-w-[1600px]">
        <p className="mb-8 text-base uppercase tracking-wide text-[#08b5f5]">Why Yatzar Manage</p>
        <h2 className="max-w-[720px] text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl xl:text-[68px]">
          More than <span className="text-[#08a9ed]">project<br className="hidden sm:block" /> management</span>.
        </h2>
        <p className="mt-8 max-w-[800px] text-base leading-[1.65] text-white/85 sm:text-lg">
          Most workflows treat handover as the finish line. Yatzar Manage treats it as the move from project information to asset information.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-5">
          <WorkflowCard title="Traditional workflow" items={traditionalWorkflow} variant="traditional" />
          <WorkflowCard title="Yatzar Manage" items={yatzarWorkflow} variant="yatzar" />
        </div>
      </div>
    </section>
  )
}

function WorkflowCard({ title, items, variant }: { title: string; items: string[]; variant: 'traditional' | 'yatzar' }) {
  const isTraditional = variant === 'traditional'

  return (
    <article className={`rounded-xl px-[30px] py-[60px] ${isTraditional ? 'bg-[#f8f8f8] text-black' : 'bg-black text-white'}`}>
      <h3 className={`border-b pb-8 text-[39px] font-semibold ${isTraditional ? 'border-[#0A0A0A]' : 'border-[#525252]'}`}>{title}</h3>
      <ul className={`divide-y ${isTraditional ? 'divide-[#0A0A0A]' : 'divide-[#525252]'}`}>
        {items.map((item) => (
          <li key={item} className="flex min-h-[67px] items-center gap-3 py-3 text-sm leading-5 sm:text-base">
            <span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center">
              {isTraditional ? (
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                  <path d="m6 6 12 12M18 6 6 18" stroke="#0A0A0A" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                  <path d="m4 12 5 5L20 6" stroke="#00A6F4" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="text-xl">{item}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

