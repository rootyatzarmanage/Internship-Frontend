import { CalendarDays, Layers3 } from 'lucide-react'

export default function MetadataSection() {
  return (
    <div className="mt-9 rounded-xl border border-[#BBBBBB] bg-[#F9F9F9] p-6">
      <h3 className="flex items-center gap-2 border-b border-[#d4d4d4] pb-4 text-[16px] font-semibold text-[#555]"><Layers3 size={15} /> System Metadata</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-lg border border-[#e6e6e6] px-4 py-4"><div><p className="text-[10px] uppercase font-semibold tracking-wide text-[#b6b6b6]">Created date</p><p className="mt-1 text-[14px] text-[#555]">27 July 2026</p></div><CalendarDays size={16} className="text-[#666]" /></div>
        <div className="flex items-center justify-between rounded-lg border border-[#e6e6e6] px-4 py-4"><div><p className="text-[10px] uppercase font-semibold tracking-wide text-[#b6b6b6]">Workspace</p><p className="mt-1 flex items-center gap-1.5 text-[14px] text-[#555]"><span className="h-1.5 w-1.5 rounded-full bg-black dark:bg-white" /> PSG</p></div><Layers3 size={16} className="text-[#666]" /></div>
      </div>
    </div>
  )
}
