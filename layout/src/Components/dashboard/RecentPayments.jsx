const recentPayments = [
  ['01', '1 month plan of AIM Project', '10002'],
  ['02', '1 month plan of PIM Project', '10004'],
  ['03', '1 month plan of AIM + BIM Project', '10022'],
  ['04', '1 month plan of AIM Project', '10052'],
  ['05', '1 month plan of PIM Project', '10202'],
  ['06', '1 month plan of AIM Project', '10342'],
  ['07', '1 month plan of AIM Project', '10042'],
]

export default function RecentPayments() {
  return (
    <section className="w-[474px] h-[375px] rounded-md border border-[#d9d9d9] bg-[#f8f8f8] p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.01)]" aria-labelledby="recent-payment-title">
      <div className="flex items-center justify-between gap-3">
        <h2 id="recent-payment-title" className="text-[18px] font-semibold text-[#2a2a2a]">Recent Payment List</h2>
        <div className="flex gap-2 text-[9px] text-[#7b7b7b]">
          <button type="button" className="rounded border border-[#d7d7d7] bg-white px-2 py-1 hover:bg-gray-50">Filter</button>
          <button type="button" className="rounded border border-[#d7d7d7] bg-white px-2 py-1 hover:bg-gray-50">See more ↗</button>
        </div>
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 text-left text-[11px] text-[#3d3d3d]">
          <thead>
            <tr>
              <th className="pb-2 text-[11px] font-medium text-[#4d4d4d]">S.no</th>
              <th className="pb-2 text-[11px] font-medium text-[#4d4d4d]">Purchased Plan</th>
              <th className="pb-2 text-right text-[11px] font-medium text-[#4d4d4d]">Purchased id</th>
            </tr>
          </thead>
          <tbody>
            {recentPayments.map(([sn, plan, id]) => (
              <tr key={`${sn}-${id}`} className="border-b border-[#e6e6e6]">
                <td className="py-2 pr-2 text-[#4f4f4f]">{sn}</td>
                <td className="py-2 pr-2 text-[#4f4f4f]">{plan}</td>
                <td className="py-2 text-right text-[#4f4f4f]">{id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
