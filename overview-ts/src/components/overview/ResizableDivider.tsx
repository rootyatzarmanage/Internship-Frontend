import { useState } from 'react'

type ResizableDividerProps = {
  onResize: (width: number) => void
}

export default function ResizableDivider({
  onResize,
}: ResizableDividerProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handlePointerDown = (
    event: React.PointerEvent<HTMLButtonElement>
  ) => {
    const divider = event.currentTarget

    divider.setPointerCapture(event.pointerId)
    setIsDragging(true)

    const content = divider.parentElement

    if (!content) return

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const bounds = content.getBoundingClientRect()

      const nextWidth =
        ((moveEvent.clientX - bounds.left) / bounds.width) * 100

      onResize(Math.min(75, Math.max(35, nextWidth)))
    }

    const handlePointerUp = () => {
      if (divider.hasPointerCapture(event.pointerId)) {
        divider.releasePointerCapture(event.pointerId)
      }

      divider.removeEventListener('pointermove', handlePointerMove)
      divider.removeEventListener('pointerup', handlePointerUp)
      divider.removeEventListener('pointercancel', handlePointerUp)

      setIsDragging(false)
    }

    divider.addEventListener('pointermove', handlePointerMove)
    divider.addEventListener('pointerup', handlePointerUp)
    divider.addEventListener('pointercancel', handlePointerUp)
  }

  return (
    <button
      type="button"
      aria-label="Resize project overview panels horizontally"
      onPointerDown={handlePointerDown}
      className={`overview-divider group relative z-10 h-full w-2 cursor-col-resize touch-none bg-transparent p-0${
        isDragging ? ' is-dragging' : ''
      }`}
    >
      <span className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-[#bcbcbc] transition-colors group-hover:bg-[#008cd2] group-active:bg-[#008cd2]" />
    </button>
  )
}