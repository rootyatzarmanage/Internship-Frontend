import { MapPin } from 'lucide-react'

export default function ProjectMap() {
  return (
    <section className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border border-[#bbbbbb] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]" aria-labelledby="project-location-title">
      <div className="flex items-center justify-between gap-3"><h2 id="project-location-title" className="text-[20px] font-medium text-[#414141]">Project location</h2><button type="button" className="flex items-center gap-1 rounded-lg border border-[#d3d3d3] px-2.5 py-1.5 text-[10px] text-[#555]"><MapPin size={13} /> Adjust pin</button></div>
      <div className="relative mt-4 min-h-0 flex-1 overflow-hidden rounded-xl border border-[#e0e0e0] bg-[#dce9d6]"><iframe title="Project location map" className="h-full w-full border-0 opacity-80" src="https://www.openstreetmap.org/export/embed.html?bbox=76.925%2C11.008%2C77.015%2C11.055&layer=mapnik&marker=11.016%2C76.955" /></div>
      <div className="mt-4 flex items-end justify-between gap-4"><div><p className="text-[12px] text-[#555]">GPS Coordinates</p><p className="mt-1 text-[11px] text-[#b7b7b7]">12.9716° N,<br />77.5946° E</p></div><button type="button" className="flex items-center gap-1 rounded-lg border border-[#d3d3d3] px-3 py-2 text-[11px] text-[#555]">Open in <span aria-hidden="true">📍</span></button></div>
    </section>
  )
}