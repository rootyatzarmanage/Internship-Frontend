const segments = [
  { label: 'Overall Workspace', color: '#1d2a3b', value: 31 },
  { label: 'Overall Projects', color: '#344156', value: 36 },
  { label: 'Overall PIM Projects', color: '#505d70', value: 20 },
  { label: 'Overall AIM Projects', color: '#697486', value: 13 },
]

export default function OverallView() {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0)
  let offset = 0

  return (
    <section className="flex h-[350px] w-[477px] flex-col rounded-lg border border-[#bbbbbb] bg-[#f8f8f8] p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.01)]" aria-labelledby="overall-view-title">
      <h2 id="overall-view-title" className="text-[18px] font-semibold text-[#2a2a2a]">Overall View</h2>
      <div className="mt-4 flex min-h-0 flex-1 items-center justify-center gap-6 sm:gap-8">
        <div
          className="relative h-[190px] w-[190px] shrink-0 rounded-full"
          style={{
            background: `conic-gradient(${segments.map(({ color, value }) => {
              const start = offset
              offset += (value / total) * 100
              return `${color} ${start}% ${offset}%`
            }).join(', ')})`,
          }}
        >
          <div className="absolute inset-[38px] rounded-full bg-[#f8f8f8]" />
        </div>
        <ul className="space-y-3 text-[10px] text-[#4d4d4d]">
          {segments.map(({ label, color }) => (
            <li key={label} className="flex items-center gap-2 whitespace-nowrap">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
