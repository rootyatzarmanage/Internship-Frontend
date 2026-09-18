import { useEffect, useRef, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import image from '../../assets/Image.png'

export default function ProjectImage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handlePointerDown = (event : PointerEvent ) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    const handleKeyDown = (event : KeyboardEvent) => {
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
    <section className="flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900" aria-labelledby="project-image-title">
      <div className="relative flex items-center justify-between px-4 pt-4 pb-3" ref={menuRef}>
        <h2 id="project-image-title" className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Project Image
        </h2>
        
        <button
          type="button"
          aria-label="Project image options"
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
          className="cursor-pointer rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-white"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          <MoreVertical size={18} />
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div 
            className="absolute right-0 top-9 z-20 w-40 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg dark:border-gray-700 dark:bg-gray-800" 
            role="menu" 
            aria-label="Project image actions"
          >
            <button 
              type="button" 
              role="menuitem" 
              className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-xs text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700" 
              onClick={() => setIsMenuOpen(false)}
            >
              View More
            </button>
            <button 
              type="button" 
              role="menuitem" 
              className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-xs text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30" 
              onClick={() => setIsMenuOpen(false)}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Image with rounded bottom corners taking full width of the card */}
      <div className="project-image-media w-full">
        <img 
          className="h-60 w-full object-cover sm:h-72 lg:h-80" 
          src={image} 
          alt="Project preview" 
        />
      </div>
    </section>
  )
}