import { useEffect, useRef, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import image from '../../assets/Image.png'

export default function ProjectImage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <section className="flex w-full flex-col overflow-hidden rounded-xl border border-[#bbbbbb] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]" aria-labelledby="project-image-title">
      <div className="relative flex items-center justify-between" ref={menuRef}>
        <h2 id="project-image-title" className="text-[20px] font-medium text-[#414141]">Project image</h2>
        <button
          type="button"
          aria-label="Project image options"
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
          className="cursor-pointer rounded-md p-1 text-[#686868] transition-colors hover:text-black"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          <MoreVertical size={18} />
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 top-10 z-20 w-40 rounded-2xl border border-[#e0e4e8] bg-white p-2 shadow-[0_8px_20px_rgba(0,0,0,0.1)]" role="menu" aria-label="Project image actions">
            <button type="button" role="menuitem" className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-[13px] text-[#52627a] transition-colors hover:bg-[#f5f7f9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#008cd2]" onClick={() => setIsMenuOpen(false)}>View More</button>
            <button type="button" role="menuitem" className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-[13px] text-[#52627a] transition-colors hover:bg-[#f5f7f9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#008cd2]" onClick={() => setIsMenuOpen(false)}>Delete</button>
          </div>
        )}
      </div>
      <div className="project-image-media mx-auto mt-5 h-40 w-full max-w-[668px] overflow-hidden rounded-xl sm:h-48 lg:h-56 xl:h-64">
        <img className="h-full w-full object-cover" src={image} alt="Project" />
      </div>
      <p className="mt-3 text-center text-[11px] leading-4 text-[#b7b7b7]">Recommended ratio 16:9, max 10MB.<br />Supports PNG, JPG.</p>
    </section>
  )
}
