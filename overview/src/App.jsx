import { useState } from 'react'
import Sidebar from './Components/layout/Sidebar'
import Header from './Components/layout/Header'
import Page from './Components/layout/page'
import './App.css'

const SIDEBAR_STORAGE_KEY = 'overview-sidebar-collapsed'

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => (
    window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true'
  ))
  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const nextState = !prev
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(nextState))
      return nextState
    })
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
        <Page />
      </main>
    </div>
  )
}

export default App