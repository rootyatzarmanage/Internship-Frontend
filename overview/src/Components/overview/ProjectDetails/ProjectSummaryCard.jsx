import { MapPin } from 'lucide-react'

export default function ProjectSummaryCard({ project }) {
  return (
    <section className="rounded-xl border border-[#bbbbbb] bg-white px-6 py-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:px-9">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-semibold leading-none tracking-[-1px] text-[#363636] sm:text-[38px]">{project.name}</h1>
          <p className="mt-3 flex items-center gap-1.5 text-[12px] text-[#b1b1b1]"><MapPin size={14} /> {project.location}</p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 rounded-full border border-[#62c982] px-2 py-0.5 font-medium text-[#309b57]"><span className="h-1.5 w-1.5 rounded-full bg-[#2cad62]" /> {project.status}</span>
          <span className="rounded-full border border-[#d2d2d2] px-2 py-0.5 text-[#696969]">{project.type}</span>
        </div>
      </div>
    </section>
  )
}
