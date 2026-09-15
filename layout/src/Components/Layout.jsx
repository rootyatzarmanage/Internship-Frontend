import { useState } from 'react'
import Header from './header'
import Sidebar from './sidebar'

const SIDEBAR_STORAGE_KEY = 'layout-sidebar-collapsed'

export default function Layout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => (
    window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true'
  ))

  const updateSidebarState = (collapsed) => {
    setIsSidebarCollapsed(collapsed)
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed))
  }

  return (
    <div className={`layout-shell relative flex min-h-screen w-full overflow-x-hidden bg-white ${isSidebarCollapsed ? 'layout-shell--sidebar-collapsed' : 'layout-shell--sidebar-expanded'}`}>
      <Sidebar isCollapsed={isSidebarCollapsed} />
      {!isSidebarCollapsed && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="layout-backdrop"
          onClick={() => updateSidebarState(true)}
        />
      )}
      <div className="layout-content relative z-0 flex min-w-0 flex-1 flex-col">
        <Header onToggleSidebar={() => updateSidebarState(!isSidebarCollapsed)} />
        <main className="min-h-0 flex-1">{children}</main>
      </div>
    </div>
  )
}