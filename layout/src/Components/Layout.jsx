import { useState } from 'react'
import Header from './header'
import Sidebar from './sidebar'

export default function Layout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className={`layout-shell relative flex min-h-screen w-full overflow-x-hidden bg-white ${isSidebarCollapsed ? 'layout-shell--sidebar-collapsed' : 'layout-shell--sidebar-expanded'}`}>
      <Sidebar isCollapsed={isSidebarCollapsed} />
      {!isSidebarCollapsed && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="layout-backdrop"
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}
      <div className="layout-content relative z-0 flex min-w-0 flex-1 flex-col">
        <Header onToggleSidebar={() => setIsSidebarCollapsed((collapsed) => !collapsed)} />
        <main className="min-h-0 flex-1">{children}</main>
      </div>
    </div>
  )
}