import { useState } from 'react'
import { MapPin } from 'lucide-react'

const MAP_VIEWPORT = {
  longitudeSpan: 0.09,
  latitudeSpan: 0.047,
}

export default function ProjectMap({ pin, onPinChange }) {
  const [isAdjustingPin, setIsAdjustingPin] = useState(false)
  const mapBounds = {
    west: pin.longitude - MAP_VIEWPORT.longitudeSpan / 2,
    east: pin.longitude + MAP_VIEWPORT.longitudeSpan / 2,
    south: pin.latitude - MAP_VIEWPORT.latitudeSpan / 2,
    north: pin.latitude + MAP_VIEWPORT.latitudeSpan / 2,
  }

  const handleMapClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
    const bounds = event.currentTarget.getBoundingClientRect()
    const horizontalPosition = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width))
    const verticalPosition = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height))
    const longitude = Number((mapBounds.west + horizontalPosition * (mapBounds.east - mapBounds.west)).toFixed(4))
    const latitude = Number((mapBounds.north - verticalPosition * (mapBounds.north - mapBounds.south)).toFixed(4))

    onPinChange({ latitude, longitude })
    setIsAdjustingPin(false)
  }

  const mapSource = `https://www.openstreetmap.org/export/embed.html?bbox=${mapBounds.west}%2C${mapBounds.south}%2C${mapBounds.east}%2C${mapBounds.north}&layer=mapnik&marker=${pin.latitude}%2C${pin.longitude}`

  return (
    <section className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border border-[#bbbbbb] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]" aria-labelledby="project-location-title">
      <div className="flex items-center justify-between gap-3"><h2 id="project-location-title" className="text-[20px] font-medium text-[#414141]">Project location</h2><button type="button" aria-pressed={isAdjustingPin} className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[10px] transition-colors ${isAdjustingPin ? 'border-[#000000] bg-[#000000] text-white' : 'border-[#d3d3d3] text-[#555] hover:border-gray-400 hover:text-black'}`} onClick={() => setIsAdjustingPin((isAdjusting) => !isAdjusting)}><MapPin size={13} /> {isAdjustingPin ? 'Select location' : 'Adjust pin'}</button></div>
      <div className={`relative mt-4 min-h-0 flex-1 overflow-hidden rounded-xl border border-[#e0e0e0] bg-[#dce9d6] ${isAdjustingPin ? 'cursor-crosshair' : ''}`}>
        <iframe title="Project location map" className={`h-full w-full border-0 opacity-80 ${isAdjustingPin ? 'pointer-events-none' : ''}`} src={mapSource} />
        {isAdjustingPin && <button type="button" aria-label="Choose a new project location on the map" className="absolute inset-0 z-20 cursor-crosshair bg-transparent" onClick={handleMapClick} />}
      </div>
      <div className="mt-4 flex items-end justify-between gap-4"><div><p className="text-[12px] text-[#555]">GPS Coordinates</p><p className="mt-1 text-[11px] text-[#b7b7b7]">{pin.latitude.toFixed(4)}° N,<br />{pin.longitude.toFixed(4)}° E</p></div><a href={`https://www.openstreetmap.org/?mlat=${pin.latitude}&mlon=${pin.longitude}#map=16/${pin.latitude}/${pin.longitude}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 rounded-lg border border-[#d3d3d3] px-3 py-2 text-[11px] text-[#555] hover:border-gray-400 hover:text-black">Open in <span aria-hidden="true">📍</span></a></div>
    </section>
  )
}
