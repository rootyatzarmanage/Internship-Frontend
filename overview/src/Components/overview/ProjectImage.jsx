import { MoreVertical } from 'lucide-react'
import image from '../../Assets/Image.png'

export default function ProjectImage() {
  return (
    <section className="rounded-xl border border-[#bbbbbb] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]" aria-labelledby="project-image-title">
      <div className="flex items-center justify-between"><h2 id="project-image-title" className="text-[20px] font-medium text-[#414141]">Project image</h2><button type="button" aria-label="Project image options" className="text-[#686868]"><MoreVertical size={18} /></button></div>
      <img className="mt-4 aspect-[16/9] w-full rounded-xl object-cover" src={image} />
      <p className="mt-4 text-center text-[11px] leading-4 text-[#b7b7b7]">Recommended ratio 16:9, max 10MB.<br />Supports PNG, JPG.</p>
    </section>
  )
}