import { MapPin, Plus, Minus } from 'lucide-react'

export default function ProjectMap() {
  return (
    <section className="rounded-xl border border-[#bbbbbb] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]" aria-labelledby="project-location-title">
      <div className="flex items-center justify-between gap-3"><h2 id="project-location-title" className="text-[20px] font-medium text-[#414141]">Project location</h2><button type="button" className="flex items-center gap-1 rounded-lg border border-[#d3d3d3] px-2.5 py-1.5 text-[10px] text-[#555]"><MapPin size={13} /> Adjust pin</button></div>
      <div className="relative mt-4 h-[220px] overflow-hidden rounded-xl border border-[#e0e0e0] bg-[#dce9d6]"><iframe title="Project location map" className="h-full w-full border-0 opacity-80" src="https://www.openstreetmap.org/export/embed.html?bbox=76.925%2C11.008%2C77.015%2C11.055&layer=mapnik&marker=11.016%2C76.955" /><div className="absolute bottom-3 right-3 flex flex-col overflow-hidden rounded-lg border border-[#d5d5d5] bg-white shadow-sm"><button type="button" aria-label="Zoom in" className="p-2 text-[#555] hover:bg-gray-50"><Plus size={14} /></button><button type="button" aria-label="Zoom out" className="border-t border-[#e5e5e5] p-2 text-[#555] hover:bg-gray-50"><Minus size={14} /></button></div></div>
      <div className="mt-6 flex items-end justify-between gap-4"><div><p className="text-[12px] text-[#555]">GPS Coordinates</p><p className="mt-1 text-[11px] text-[#b7b7b7]">12.9716° N,<br />77.5946° E</p></div><button type="button" className="flex items-center gap-1 rounded-lg border border-[#d3d3d3] px-3 py-2 text-[11px] text-[#555]">Open in <span aria-hidden="true">📍</span></button></div>
    </section>
  )
}