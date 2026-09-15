import { MoreVertical } from 'lucide-react'
import image from '../../Assets/Image.png'

export default function ProjectImage() {
  return (
    <section className="flex w-full flex-col overflow-hidden rounded-xl border border-[#bbbbbb] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]" aria-labelledby="project-image-title">
      <div className="flex items-center justify-between"><h2 id="project-image-title" className="text-[20px] font-medium text-[#414141]">Project image</h2><button type="button" aria-label="Project image options" className="text-[#686868]"><MoreVertical size={18} /></button></div>
      <div className="mx-auto mt-5 h-40 w-full max-w-[668px] overflow-hidden rounded-xl sm:h-48 lg:h-56 xl:h-64">
        <img className="h-full w-full object-cover" src={image} alt="Project" />
      </div>
      <p className="mt-3 text-center text-[11px] leading-4 text-[#b7b7b7]">Recommended ratio 16:9, max 10MB.<br />Supports PNG, JPG.</p>
    </section>
  )
}