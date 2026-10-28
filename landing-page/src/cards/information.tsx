const stats = [
  {
    value: '57%',
    description: 'of the yearly cost of lost and re-entered information arises in operation, after handover.',
  },
  {
    value: '2/3',
    description: 'of the cost of poor data exchange falls on owners and operators.',
  },
  {
    value: '60-80%',
    description: 'of a building’s life cycle cost is operation and maintenance.',
  },
]

export default function Information() {
  return (
    <section id="information-problem" className="bg-[#0a0a0a] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-24 2xl:px-0">
      <div className="mx-auto w-full max-w-[1600px]">
        <p className="mb-8 text-base uppercase tracking-wide text-[#08b5f5]">The information problem</p>
        <h2 className="max-w-[950px] text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[76px]">
          The project ends. <br className="hidden sm:block" /> The <span className="text-[#08a9ed]">information</span><br className="hidden sm:block" /> shouldn’t.
        </h2>
        <p className="mt-8 max-w-[900px] text-xl leading-[1.65] text-white/85 sm:text-xl">
          Many teams create information, in many tools, and much of it is lost at handover. Yatzar Manage carries it forward into the working life of the asset.
        </p>

        <div className="mt-20 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {stats.map((stat) => (
            <article key={stat.value}>
              <p className="text-6xl font-bold leading-none tracking-tight text-[#08a9ed] sm:text-[68px]">{stat.value}</p>
              <p className="mt-7 max-w-[470px] text-xl leading-[1.65] text-white/90">{stat.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

