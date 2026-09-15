import { useState } from 'react'
import Sidebar from './Components/layout/Sidebar'
import Header from './Components/layout/Header'
import ProjectDetails from './Components/cards/ProjectDetails'
import ProjectImage from './Components/cards/ProjectImage'
import ProjectMap from './Components/cards/ProjectMap'
import './App.css'

const SIDEBAR_STORAGE_KEY = 'overview-sidebar-collapsed'

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => (
    window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true'
  ))
  const [leftPanelWidth, setLeftPanelWidth] = useState(64)
  const [isDividerDragging, setIsDividerDragging] = useState(false)

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const nextState = !prev
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(nextState))
      return nextState
    })
  }

  const handleDividerPointerDown = (event) => {
    const divider = event.currentTarget
    divider.setPointerCapture(event.pointerId)
    setIsDividerDragging(true)
    const content = divider.parentElement

    const handlePointerMove = (moveEvent) => {
      const bounds = content.getBoundingClientRect()
      const nextWidth = ((moveEvent.clientX - bounds.left) / bounds.width) * 100
      setLeftPanelWidth(Math.min(75, Math.max(35, nextWidth)))
    }

    const handlePointerUp = () => {
      if (divider.hasPointerCapture(event.pointerId)) {
        divider.releasePointerCapture(event.pointerId)
      }
      divider.removeEventListener('pointermove', handlePointerMove)
      divider.removeEventListener('pointerup', handlePointerUp)
      divider.removeEventListener('pointercancel', handlePointerUp)
      setIsDividerDragging(false)
    }

    divider.addEventListener('pointermove', handlePointerMove)
    divider.addEventListener('pointerup', handlePointerUp)
    divider.addEventListener('pointercancel', handlePointerUp)
  }

  return (
    <div className="overview-shell flex h-screen min-h-0 overflow-hidden">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      {!isSidebarCollapsed && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="overview-sidebar-backdrop"
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#f7f7f7]">
        <Header onToggleSidebar={handleToggleSidebar} />
        <div className="overview-panels grid min-h-0 flex-1" style={{ '--left-panel-width': `${leftPanelWidth}fr`, '--right-panel-width': `${100 - leftPanelWidth}fr` }}>
          <section className="min-h-0 min-w-0 overflow-y-auto px-5 py-9 xl:px-9">
            <ProjectDetails />
          </section>
          <button type="button" aria-label="Resize project overview panels horizontally" onPointerDown={handleDividerPointerDown} className={`overview-divider group relative z-10 h-full w-2 cursor-col-resize bg-transparent p-0 touch-none${isDividerDragging ? ' is-dragging' : ''}`}>
            <span className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-[#bcbcbc] transition-colors group-hover:bg-[#008cd2] group-active:bg-[#008cd2]" />
          </button>
          <section className="overview-right-panel min-h-0 min-w-0 overflow-hidden px-5 py-9 xl:px-8">
            <div
              className="grid h-full min-h-0 w-full gap-16"
              style={{ gridTemplateRows: 'auto minmax(0, 1fr)' }}
            >
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