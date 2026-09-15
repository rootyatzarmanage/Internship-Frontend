import { CalendarDays, ChevronDown, CircleHelp, Layers3, MapPin } from 'lucide-react'

function Field({ label, value, icon }) {
  return (
    <label className="block text-[9px] uppercase tracking-wide text-[#b6b6b6]">
      {label}
      <span className="mt-1.5 flex h-10 items-center gap-2 rounded-lg border border-[#e3e3e3] bg-[#fafafa] px-3 text-[12px] normal-case tracking-normal text-[#6c6c6c]">
        {icon}
        <span className="min-w-0 truncate">{value}</span>
        {label === 'Project type' ? <ChevronDown className="ml-auto shrink-0" size={14} /> : null}
      </span>
    </label>
  )
}

export default function ProjectDetails() {
  return (
    <div className="w-full space-y-7">
      <section className="rounded-xl border border-[#bbbbbb] bg-white px-6 py-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:px-9">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-semibold leading-none tracking-[-1px] text-[#363636] sm:text-[38px]">PSG - Y - Block</h1>
            <p className="mt-3 flex items-center gap-1.5 text-[12px] text-[#b1b1b1]"><MapPin size={14} /> Peelamedu, Coimbatore</p>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 rounded-full border border-[#62c982] px-2 py-0.5 font-medium text-[#309b57]"><span className="h-1.5 w-1.5 rounded-full bg-[#2cad62]" /> Active</span>
            <span className="rounded-full border border-[#d2d2d2] px-2 py-0.5 text-[#696969]">PIM</span>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#bbbbbb] bg-white px-6 py-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:px-9">
        <h2 className="text-[24px] font-medium text-[#3d3d3d]">Project details</h2>
        <p className="mt-1 text-[12px] text-[#b9b9b9]">Structured overview and metadata configuration</p>
        <div className="mt-6 border-t border-[#dedede] pt-8">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2 text-[13px] font-semibold text-[#555]"><CircleHelp size={15} /> General Information</h3>
              <div className="mt-7 space-y-6"><Field label="Project type" value="PIM" /><Field label="Description" value="PSG-Y-Block Description" /></div>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-[13px] font-semibold text-[#555]"><MapPin size={15} /> Location &amp; Coordinates</h3>
              <div className="mt-7 space-y-6">
                <Field label="Location" value="Peelamedu, Coimbatore" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Latitude" value="12.9716° N" />
                  <Field label="Longitude" value="77.5946° E" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-9 rounded-xl border border-[#BBBBBB] bg-[#F9F9F9] p-6">
            <h3 className="flex items-center gap-2 border-b border-[#d4d4d4] pb-4 text-[13px] font-semibold text-[#555]"><Layers3 size={15} /> System Metadata</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border border-[#e6e6e6] px-4 py-4"><div><p className="text-[9px] uppercase tracking-wide text-[#b6b6b6]">Created date</p><p className="mt-1 text-[12px] text-[#555]">27 July 2026</p></div><CalendarDays size={16} className="text-[#666]" /></div>
              <div className="flex items-center justify-between rounded-lg border border-[#e6e6e6] px-4 py-4"><div><p className="text-[9px] uppercase tracking-wide text-[#b6b6b6]">Workspace</p><p className="mt-1 flex items-center gap-1.5 text-[12px] text-[#555]"><span className="h-1.5 w-1.5 rounded-full bg-black" /> PSG</p></div><Layers3 size={16} className="text-[#666]" /></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}