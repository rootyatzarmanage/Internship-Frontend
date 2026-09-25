import { useEffect, useRef, useState } from 'react'
import { Calendar, Layers, MapPin, MoreVertical, User, Users } from 'lucide-react'
import backgroundImage from '../../assets/background.png'
import projectImage from '../../assets/Image.png'
import { projectMock } from '../../mock/overviewMock'
import type { Project, ProjectChangeField } from '../../types/overview'

type PanelStyle = React.CSSProperties & {
  '--left-panel-width': string
  '--right-panel-width': string
}

type Pin = Pick<Project, 'latitude' | 'longitude'>

const MAP_VIEWPORT = {
  longitudeSpan: 0.09,
  latitudeSpan: 0.047,
}

function ProjectDetails({ project }: { project: Project }) {
  return (
    <section className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-none dark:border-gray-800 dark:bg-black">
      <div className="relative h-78 w-full shrink-0 overflow-hidden">
        <img src={backgroundImage} alt="Project background" className="h-full w-full object-cover object-center" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
        <div className="absolute bottom-4 right-5 z-10 rounded-full border border-white/50 bg-black/30 px-3.5 py-1 text-xs font-medium text-white backdrop-blur-md">
          {project.projectType}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-[#111827] dark:text-white">{project.name}</h1>
              <div className="mt-2 flex items-center gap-1.5 text-sm text-[#8c94a0]">
                <MapPin className="h-3.5 w-3.5 text-[#9ca3af]" />
                <span>{project.location}</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#22c55e]/40 bg-white px-3 py-1 text-xs font-medium text-[#16a34a]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
              {project.status}
            </span>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#4b5563]">Description</h2>
            <p className="ml-2 mt-1.5 text-medium leading-relaxed text-[#374151]">{project.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <div><span className="block text-sm font-semibold text-[#4b5563]">Project Type</span><span className="ml-2 mt-1.5 block text-sm font-regular text-[#111827] dark:text-gray-300">{project.projectType}</span></div>
          <div><span className="block text-sm font-semibold text-[#4b5563]">Location</span><span className="ml-2 mt-1.5 block text-sm font-regular text-[#111827] dark:text-gray-300">{project.location}</span></div>
          <div><span className="block text-sm font-semibold text-[#4b5563]">Latitude</span><span className="ml-2 mt-1.5 block text-sm font-regular text-[#111827] dark:text-gray-300">{project.latitude}</span></div>
          <div><span className="block text-sm font-semibold text-[#4b5563]">Longitude</span><span className="ml-2 mt-1.5 block text-sm font-regular text-[#111827] dark:text-gray-300">{project.longitude}</span></div>
        </div>

        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          <div className="rounded-xl bg-[#F5F5F5] p-3.5 dark:bg-black/60"><div className="flex items-center gap-1.5 text-[10px] font-medium text-[#4b5563] md:text-[12px] lg:text-[14px]"><Calendar className="h-2.5 w-2.5 text-[#6b7280] md:h-3.5 md:w-3.5" />Created</div><p className="mt-1.5 text-[12px] font-semibold text-[#111827] dark:text-white md:text-[14px] lg:text-[16px]">{project.createdDate}</p></div>
          <div className="rounded-xl bg-[#f7f7f8] p-3.5 dark:bg-black/60"><div className="flex items-center gap-1.5 text-[10px] font-medium text-[#4b5563] md:text-[12px] lg:text-[14px]"><Layers className="h-2.5 w-2.5 text-[#6b7280] md:h-3.5 md:w-3.5" />Workspace</div><p className="mt-1.5 text-sm font-semibold text-[#111827] dark:text-white">{project.workspace}</p></div>
          <div className="rounded-xl bg-[#f7f7f8] p-3.5 dark:bg-black/60"><div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#4b5563] md:text-[12px] lg:text-[14px]"><User className="h-2.5 w-2.5 text-[#6b7280] md:h-3.5 md:w-3.5" />Owned</div><p className="mt-1.5 text-sm font-semibold text-[#111827] dark:text-white">{project.owner}</p></div>
          <div className="rounded-xl bg-[#f7f7f8] p-3.5 dark:bg-black/60"><div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#4b5563] md:text-[12px] lg:text-[14px]"><Users className="h-2.5 w-2.5 text-[#6b7280] md:h-3.5 md:w-3.5" />Members</div><p className="mt-1.5 text-sm font-semibold text-[#111827] dark:text-white">{project.membersCount}</p></div>
        </div>
      </div>
    </section>
  )
}

function ProjectImage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsMenuOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <section className="flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black" aria-labelledby="project-image-title">
      <div className="relative flex items-center justify-between px-4 pb-3 pt-4" ref={menuRef}>
        <h2 id="project-image-title" className="text-base font-semibold text-gray-900 dark:text-gray-100">Project Image</h2>
        <button type="button" aria-label="Project image options" aria-expanded={isMenuOpen} aria-haspopup="menu" className="cursor-pointer rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-black dark:hover:text-white" onClick={() => setIsMenuOpen((open) => !open)}><MoreVertical size={18} /></button>
        {isMenuOpen && <div className="absolute right-0 top-9 z-20 w-40 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg dark:border-gray-700 dark:bg-black" role="menu" aria-label="Project image actions"><button type="button" role="menuitem" className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-xs text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>View More</button><button type="button" role="menuitem" className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-xs text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30" onClick={() => setIsMenuOpen(false)}>Delete</button></div>}
      </div>
      <div className="project-image-media w-full"><img className="h-60 w-full object-cover sm:h-72 lg:h-80" src={projectImage} alt="Project preview" /></div>
    </section>
  )
}

function ProjectMap({ pin, onPinChange }: { pin: Pin; onPinChange: (pin: Pin) => void }) {
  const mapBounds = {
    west: pin.longitude - MAP_VIEWPORT.longitudeSpan / 2,
    east: pin.longitude + MAP_VIEWPORT.longitudeSpan / 2,
    south: pin.latitude - MAP_VIEWPORT.latitudeSpan / 2,
    north: pin.latitude + MAP_VIEWPORT.latitudeSpan / 2,
  }

  const handleMapClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const bounds = event.currentTarget.getBoundingClientRect()
    const horizontalPosition = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width))
    const verticalPosition = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height))
    const longitude = Number((mapBounds.west + horizontalPosition * (mapBounds.east - mapBounds.west)).toFixed(4))
    const latitude = Number((mapBounds.north - verticalPosition * (mapBounds.north - mapBounds.south)).toFixed(4))
    onPinChange({ latitude, longitude })
  }

  const mapSource = `https://www.openstreetmap.org/export/embed.html?bbox=${mapBounds.west}%2C${mapBounds.south}%2C${mapBounds.east}%2C${mapBounds.north}&layer=mapnik&marker=${pin.latitude}%2C${pin.longitude}`

  return (
    <section className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black" aria-labelledby="project-location-title">
      <div className="flex items-center justify-between px-4 pb-3 pt-4"><h2 id="project-location-title" className="text-lg font-semibold text-gray-800 dark:text-gray-100">Project Location</h2><div className="flex items-center gap-2"><a href={`https://www.openstreetmap.org/?mlat=${pin.latitude}&mlon=${pin.longitude}#map=16/${pin.latitude}/${pin.longitude}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">Open in <span aria-hidden="true">📍</span></a></div></div>
      <div className="relative flex w-full flex-1 overflow-hidden"><iframe title="Project location map" className="h-full w-full border-0" src={mapSource} /><button type="button" aria-label="Choose a new project location on the map" className="absolute inset-0 z-20 cursor-crosshair bg-transparent" onClick={handleMapClick} /></div>
    </section>
  )
}

function ResizableDivider({ onResize }: { onResize: (width: number) => void }) {
  const [isDragging, setIsDragging] = useState(false)

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    const divider = event.currentTarget
    divider.setPointerCapture(event.pointerId)
    setIsDragging(true)
    const content = divider.parentElement
    if (!content) return

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const bounds = content.getBoundingClientRect()
      const nextWidth = ((moveEvent.clientX - bounds.left) / bounds.width) * 100
      onResize(Math.min(75, Math.max(35, nextWidth)))
    }
    const handlePointerUp = () => {
      if (divider.hasPointerCapture(event.pointerId)) divider.releasePointerCapture(event.pointerId)
      divider.removeEventListener('pointermove', handlePointerMove)
      divider.removeEventListener('pointerup', handlePointerUp)
      divider.removeEventListener('pointercancel', handlePointerUp)
      setIsDragging(false)
    }
    divider.addEventListener('pointermove', handlePointerMove)
    divider.addEventListener('pointerup', handlePointerUp)
    divider.addEventListener('pointercancel', handlePointerUp)
  }

  return <button type="button" aria-label="Resize project overview panels horizontally" onPointerDown={handlePointerDown} className={`overview-divider group relative z-10 h-full w-2 cursor-col-resize touch-none bg-transparent p-0${isDragging ? ' is-dragging' : ''}`}><span className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-[#bcbcbc] transition-colors group-hover:bg-[#008cd2] group-active:bg-[#008cd2]" /></button>
}

export default function Page() {
  const [leftPanelWidth, setLeftPanelWidth] = useState(66)
  const [isCompact, setIsCompact] = useState(() => window.innerWidth < 1280)
  const [project, setProject] = useState<Project>(projectMock)

  useEffect(() => {
    const updateLayout = () => setIsCompact(window.innerWidth < 1280)
    window.addEventListener('resize', updateLayout)
    return () => window.removeEventListener('resize', updateLayout)
  }, [])

  const handleProjectChange = (field: ProjectChangeField, value: string | number) => {
    setProject((currentProject) => ({
      ...currentProject,
      [field]: field === 'latitude' || field === 'longitude' ? Number(value) : value,
    }))
  }

  const handlePinChange = ({ latitude, longitude }: Pin) => {
    setProject((currentProject) => ({ ...currentProject, latitude, longitude }))
  }

  void handleProjectChange

  return (
    <div className="overview-panels grid min-h-0 flex-1 overflow-hidden" style={{ '--left-panel-width': `${leftPanelWidth}fr`, '--right-panel-width': `${100 - leftPanelWidth}fr`, gridTemplateColumns: isCompact ? 'minmax(0, 1fr)' : 'minmax(0, var(--left-panel-width)) 8px minmax(0, var(--right-panel-width))', height: '100%', minHeight: 0 } as PanelStyle}>
      <section className="overview-left-column min-h-0 min-w-0 overflow-hidden px-5 py-9 xl:px-9"><ProjectDetails project={project} /></section>
      <ResizableDivider onResize={setLeftPanelWidth} />
      <section className="overview-right-panel min-h-0 min-w-0 overflow-hidden px-5 py-9 xl:px-8"><div className="grid h-full min-h-0 w-full gap-16" style={{ gridTemplateRows: 'auto minmax(0, 1fr)' }}><ProjectImage /><ProjectMap pin={project} onPinChange={handlePinChange} /></div></section>
    </div>
  )
}
