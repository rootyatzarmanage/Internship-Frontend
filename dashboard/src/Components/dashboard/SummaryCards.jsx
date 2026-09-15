const summaryCards = [
  { label: 'Total Workspace', value: '4', change: '+40%', trend: 'up' },
  { label: 'Total Projects', value: '5', change: '+40%', trend: 'up' },
  { label: 'Total PIM Projects', value: '3', change: '+40%', trend: 'down' },
  { label: 'Total AIM Projects', value: '2', change: '+40%', trend: 'down' },
]

function TrendLine({ direction }) {
  const points = direction === 'up'
    ? '0,27 7,25 13,29 20,17 27,18 34,8 41,4'
    : '0,7 7,10 13,20 20,16 27,27 34,14 41,24'

  return (
    <svg viewBox="0 0 41 31" className={`h-9 w-12 ${direction === 'up' ? 'text-[#91e548]' : 'text-[#ff6e77]'}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${direction}-trend-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,31 ${points} 41,31`} fill={`url(#${direction}-trend-fill)`} />
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function SummaryCards() {
  return (
    <section aria-label="Workspace summary" className="grid grid-cols-1 gap-x-[30px] gap-y-[40px] sm:grid-cols-2">
      {summaryCards.map(({ label, value, change, trend }) => (
        <article key={label} className="flex h-[155px] w-[292px] items-center justify-between rounded-lg border border-[#bbbbbb] bg-[#f8f8f8] px-4 py-3 shadow-[0_0_0_1px_rgba(0,0,0,0.01)]">
          <div>
            <h2 className="text-[14px] font-semibold text-[#2a2a2a]">{label}</h2>
            <p className="mt-2 text-[48px] font-semibold leading-none text-[#121212]">{value}</p>
            <p className="mt-2 text-[14px] text-[#111111]">
              <span className={`text-[10px] ${trend === 'up' ? 'font-medium text-[#00bd59]' : 'font-medium text-[#ff3d48]'}`}>{change}</span>
           <span className='text-[10px]'>vs last month</span>   
            </p>
          </div>
          <TrendLine direction={trend} />
        </article>
      ))}
    </section>
  )
}
