const MAP_VIEWPORT = {
  longitudeSpan: 0.09,
  latitudeSpan: 0.047,
}

type Pin = {
  latitude: number
  longitude: number
}

type ProjectMapProps = {
  pin: Pin
  onPinChange: (pin: Pin) => void
}

export default function ProjectMap({ pin, onPinChange } : ProjectMapProps) {
  
  const mapBounds = {
    west: pin.longitude - MAP_VIEWPORT.longitudeSpan / 2,
    east: pin.longitude + MAP_VIEWPORT.longitudeSpan / 2,
    south: pin.latitude - MAP_VIEWPORT.latitudeSpan / 2,
    north: pin.latitude + MAP_VIEWPORT.latitudeSpan / 2,
  }

  const handleMapClick = (event :  React.MouseEvent<HTMLButtonElement>) => {
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
    <section 
      className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900" 
      aria-labelledby="project-location-title"
    >
      {/* Header section with padding matching reference image */}
      <div className="flex items-center justify-between px-4 pb-3 pt-4">
        <h2 id="project-location-title" className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Project Location
        </h2>

        <div className="flex items-center gap-2">

          {/* Open In External Map Link */}
          <a 
            href={`https://www.openstreetmap.org/?mlat=${pin.latitude}&mlon=${pin.longitude}#map=16/${pin.latitude}/${pin.longitude}`} 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
          >
            Open in <span aria-hidden="true">📍</span>
          </a>
        </div>
      </div>

      {/* Map iframe extending flush to bottom, left, and right */}
      <div className={`relative flex-1 w-full overflow-hidden`}>
        <iframe 
          title="Project location map" 
          className={`h-full w-full border-0`} 
          src={mapSource} 
        />
          <button 
            type="button" 
            aria-label="Choose a new project location on the map" 
            className="absolute inset-0 z-20 cursor-crosshair bg-transparent" 
            onClick={handleMapClick} 
          />
      </div>
    </section>
  )
}