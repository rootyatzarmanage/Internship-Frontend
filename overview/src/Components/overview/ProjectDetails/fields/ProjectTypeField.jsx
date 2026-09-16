import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

const PROJECT_TYPES = ['PIM', 'AIM']

export default function ProjectTypeField({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-[9px] uppercase tracking-wide text-[#b6b6b6]">
        Project type
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="mt-1.5 flex h-10 w-full items-center gap-2 rounded-lg border border-[#e3e3e3] bg-[#fafafa] px-3 text-left text-[12px] normal-case tracking-normal text-[#6c6c6c] transition-colors focus-within:border-[#8a8a8a]"
        >
          <span className="min-w-0 flex-1 truncate">{value}</span>
          <ChevronDown className={`ml-auto shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={14} />
        </button>
      </label>

      {isOpen ? (
        <ul className="absolute left-0 right-0 top-full z-10 mt-1.5 w-full overflow-hidden rounded-lg border border-[#e3e3e3] bg-white text-[12px] text-[#6c6c6c] shadow-[0_4px_10px_rgba(0,0,0,0.08)]">
          {PROJECT_TYPES.map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => {
                  onChange(option)
                  setIsOpen(false)
                }}
                className={`flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-[#f5f5f5] ${option === value ? 'text-[#363636]' : ''}`}
              >
                {option}
                {option === value ? <Check size={14} /> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
