import { useState } from 'react'

type Stage = {
  title: string
  description: string
  records: string[]
}

const buildStages: Stage[] = [
  { title: 'Define', description: 'Capture the requirement', records: ['Requirements', 'Programme', 'Team & appointments'] },
  { title: 'Design', description: 'Model the intent', records: ['Models', 'Coordination', 'Cost plan', 'Compliance'] },
  { title: 'Execute', description: 'Construct as specified', records: ['Procurement', 'Financials', 'Progress & records'] },
  { title: 'Handover', description: 'Transfer the digital twin', records: ['Asset data', 'Handover pack', 'Publish to AIM'] },
]

const assetStages: Stage[] = [
  { title: 'Operate', description: 'Use the asset', records: ['Asset register', 'Live monitoring', 'Service requests'] },
  { title: 'Maintain', description: 'Preserve asset integrity', records: ['Maintenance plans', 'Work orders', 'Warranties'] },
  { title: 'Optimise', description: 'Improve through insight', records: ['Insights', 'Energy & carbon', 'Space'] },
  { title: 'Renew', description: 'Recover & reintegrate', records: ['Condition', 'Lifecycle plan', 'Refurbish'] },
]

export default function EightStages() {
  const [activePhase, setActivePhase] = useState<'build' | 'asset'>('build')
  const stages = activePhase === 'build' ? buildStages : assetStages
  const firstStageNumber = activePhase === 'build' ? 1 : 5

  return (
    <section id="eight-stages" className="bg-[#171717] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-24 2xl:px-0">
      <div className="mx-auto w-full max-w-[1600px]">
        <p className="mb-8 text-lg uppercase tracking-wide text-[#08b5f5]">One record. Eight stages.</p>
        <h2 className="max-w-[950px] text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[76px]">
          Information moves<br className="hidden sm:block" /> with the <span className="text-[#08a9ed]">asset</span>.
        </h2>
        <p className="mt-6 max-w-[750px] text-lg leading-7 text-white/85 sm:mt-8 sm:text-xl">
          Stages and information flows follow ISO 19650. What the design team writes in week one is what the facility manager reads in year twenty.
        </p>

        <div role="tablist" aria-label="Information lifecycle phase" className="mt-10 flex w-full max-w-full overflow-hidden rounded-lg border border-[#00a6f4] text-sm sm:mt-16 sm:inline-flex sm:w-auto sm:text-lg">
          <button type="button" role="tab" aria-selected={activePhase === 'build'} onClick={() => setActivePhase('build')} className={`min-w-0 flex-1 px-2 py-2 transition hover:cursor-pointer sm:flex-none sm:px-3 ${activePhase === 'build' ? 'bg-[#00a6f4] text-white' : 'bg-transparent text-white hover:bg-white/10'}`}>While you build - PIM</button>
          <button type="button" role="tab" aria-selected={activePhase === 'asset'} onClick={() => setActivePhase('asset')} className={`min-w-0 flex-1 border-l border-[#00a6f4] px-2 py-2 transition hover:cursor-pointer sm:flex-none sm:px-3 ${activePhase === 'asset' ? 'bg-[#00a6f4] text-white' : 'bg-transparent text-white hover:bg-white/10'}`}>After you build - AIM</button>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-y-8 gap-x-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
          {stages.map((stage, index) => (
            <article key={stage.title} className="min-w-0 border-[#525252] sm:px-5 first:sm:pl-0 lg:border-r lg:py-0 lg:last:border-r-0">
              <p className="text-xl text-[#08b5f5]">Stage {firstStageNumber + index} of 8</p>
              <h3 className="mt-4 text-3xl font-semibold leading-tight sm:text-[39px]">{stage.title}</h3>
              <p className="mt-4 text-xl text-white/90">{stage.description}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {stage.records.map((record) => <li key={record} className="rounded-sm bg-[#00a6f4] px-2 py-1 text-base leading-5 text-white">{record}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

