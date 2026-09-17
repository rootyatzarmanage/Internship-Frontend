import { useEffect, useState } from 'react'
import Header from './Header/Header'
import Sidebar from './Sidebar/Sidebar'
import { useTheme } from '../theme/theme'

const SIDEBAR_STORAGE_KEY = 'layout-sidebar-collapsed'

export default function Layout({ children }) {
  const { isDarkMode, toggleTheme } = useTheme()

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
  // Always start collapsed when viewport is 426px or smaller
  if (window.innerWidth <= 426) {
    return true
  }

  return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true'
})

const updateSidebarState = (collapsed) => {
  setIsSidebarCollapsed(collapsed)
  window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed))
}

useEffect(() => {
  const handleResize = () => {
    const isVerySmallScreen = window.innerWidth <= 426

    if (isVerySmallScreen) {
      // Automatically collapse when entering <= 426px
      setIsSidebarCollapsed(true)
    } else {
      // When leaving <= 426px, restore the user's saved sidebar state
      const savedState =
        window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true'

      setIsSidebarCollapsed(savedState)
    }
  }

  window.addEventListener('resize', handleResize)

  return () => {
    window.removeEventListener('resize', handleResize)
  }
}, [])

  return (
    <div
      className={`layout-shell relative flex min-h-screen w-full overflow-x-hidden bg-white text-gray-900 transition-colors dark:bg-[#080808] dark:text-gray-100 ${
        isSidebarCollapsed
          ? 'layout-shell--sidebar-collapsed'
          : 'layout-shell--sidebar-expanded'
      }`}
    >
      <Sidebar isCollapsed={isSidebarCollapsed} />

      {!isSidebarCollapsed && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="layout-backdrop"
          onClick={() => updateSidebarState(true)}
        />
      )}

      <div className="layout-content relative flex min-w-0 flex-1 flex-col">
        <Header
          isDarkMode={isDarkMode}
          isSidebarOpen={!isSidebarCollapsed}
          onToggleSidebar={() =>
            updateSidebarState(!isSidebarCollapsed)
          }
          onToggleTheme={toggleTheme}
        />

        <main className="min-h-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}