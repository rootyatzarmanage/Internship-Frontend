import { useEffect, useRef, useState } from 'react'

export default function Viewer() {
  const [fullscreen, setFullscreen] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)
  const modelContainerRef = useRef<HTMLDivElement>(null)
  const modelViewerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const container = modelContainerRef.current
    if (!container) return

    const modelViewer = document.createElement('model-viewer')
    modelViewer.setAttribute('src', '/model/house.glb')
    modelViewer.setAttribute('alt', 'Interactive 3D model of a house')
    modelViewer.setAttribute('camera-controls', '')
    modelViewer.setAttribute('touch-action', 'pan-y')
    modelViewer.setAttribute('shadow-intensity', '0.8')
    modelViewer.setAttribute('camera-orbit', '45deg 65deg 105%')
    modelViewer.setAttribute('loading', 'eager')
    modelViewer.style.width = '100%'
    modelViewer.style.height = '100%'
    modelViewer.style.display = 'block'
    modelViewer.addEventListener('load', () => setModelLoaded(true))
    modelViewer.addEventListener('error', () => setModelLoaded(false))
    modelViewerRef.current = modelViewer
    container.appendChild(modelViewer)

    return () => {
      modelViewer.remove()
      modelViewerRef.current = null
    }
  }, [])

  return (
    <section id="how-it-works" className="scroll-mt-[78px] bg-[#171717] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-24 2xl:px-0">
      <div className="mx-auto w-full max-w-[1600px]">
        <p className="mb-8 text-base uppercase tracking-wide text-[#08b5f5]">See the connection</p>
        <h2 className="max-w-full text-[76px] font-bold leading-[1.12] tracking-[-0.02em]">
          From a model element to<br className="hidden sm:block" /> its <span className="text-[#08a9ed]">records</span>.
        </h2>
        <p className="mt-8 max-w-[780px] text-xl leading-6 text-white/85">
          Select an element in the IFC model and see the asset ID, class, level and the records attached to it: manuals, warranties and work orders.
        </p>

        <div className={`relative mt-8 aspect-[2.45] w-full overflow-hidden rounded-xl border border-white/15 bg-[#e9eef4] text-[#475467] shadow-[0_8px_30px_rgba(0,0,0,0.25)] ${fullscreen ? 'fixed inset-4 z-50 mt-0 aspect-auto' : ''}`}>
          <div ref={modelContainerRef} className="absolute inset-0 bg-[linear-gradient(180deg,#e9eef4_0%,#f5f7fa_55%,#e9eef4_100%)]" />
          {!modelLoaded && <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/30 p-6 text-center">
            <p className="rounded-lg bg-white/90 px-4 py-3 text-sm text-slate-600 shadow-sm">Loading house model…</p>
          </div>}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button type="button" onClick={() => modelViewerRef.current?.setAttribute('camera-orbit', '45deg 65deg 105%')} className="rounded-md border border-slate-300 bg-white/90 px-3 py-2 text-xs text-slate-600 shadow-sm hover:bg-white hover:cursor-pointer">Isometric</button>
            <button type="button" onClick={() => setFullscreen((value) => !value)} className="rounded-md border border-slate-300 bg-white/90 px-3 py-2 text-xs text-slate-700 shadow-sm transition hover:bg-white hover:cursor-pointer">
              {fullscreen ? 'Exit full screen' : 'Full screen'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}


