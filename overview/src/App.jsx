import { useState } from 'react'
import Sidebar from './Components/layout/Sidebar'
import Header from './Components/layout/Header'
import ProjectDetails from './Components/overview/ProjectDetails'
import ProjectImage from './Components/overview/ProjectImage'
import ProjectMap from './Components/overview/ProjectMap'

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [leftPanelWidth, setLeftPanelWidth] = useState(58)

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev)
  }

  const handleDividerPointerDown = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    const content = event.currentTarget.parentElement

    const handlePointerMove = (moveEvent) => {
      const bounds = content.getBoundingClientRect()
      const nextWidth = ((moveEvent.clientX - bounds.left) / bounds.width) * 100
      setLeftPanelWidth(Math.min(75, Math.max(35, nextWidth)))
    }

    const handlePointerUp = () => {
      event.currentTarget.releasePointerCapture(event.pointerId)
      event.currentTarget.removeEventListener('pointermove', handlePointerMove)
      event.currentTarget.removeEventListener('pointerup', handlePointerUp)
    }

    event.currentTarget.addEventListener('pointermove', handlePointerMove)
    event.currentTarget.addEventListener('pointerup', handlePointerUp)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <main className="min-w-0 flex-1 bg-[#f7f7f7]">
        <Header onToggleSidebar={handleToggleSidebar} />
        <div className="grid min-h-[calc(100vh-36px)]" style={{ gridTemplateColumns: `minmax(0, ${leftPanelWidth}fr) 8px minmax(0, ${100 - leftPanelWidth}fr)` }}>
          <section className="min-w-0 overflow-y-auto px-5 py-9 xl:px-9">
            <ProjectDetails />
          </section>
          <button type="button" aria-label="Resize project overview panels" onPointerDown={handleDividerPointerDown} className="group relative z-10 h-full w-2 cursor-col-resize bg-transparent p-0 touch-none">
            <span className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-[#bcbcbc] transition-colors group-hover:bg-[#008cd2] group-active:bg-[#008cd2]" />
          </button>
          <section className="min-w-0 overflow-y-auto px-5 py-9 xl:px-8">
            <div className="mx-auto flex max-w-[430px] flex-col gap-16">
              <ProjectImage />
              <ProjectMap />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App