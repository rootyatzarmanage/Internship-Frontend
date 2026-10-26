import { useEffect, useState, type ReactNode } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { useTheme } from './theme'

const SIDEBAR_STORAGE_KEY = 'layout-sidebar-collapsed'

type LayoutProps = {
  children: ReactNode,
}

export default function Layout({ children }: LayoutProps) {
  const { isDarkMode, toggleTheme } = useTheme()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    // Always start collapsed when viewport is 426px or smaller
    if (typeof window !== 'undefined' && window.innerWidth <= 426) {
      return true
    }

    return typeof window !== 'undefined' && window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true'
  })

  const updateSidebarState = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed)
    window.localStorage.setItem(
      SIDEBAR_STORAGE_KEY,
      String(collapsed)
    )
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
    /* Changed min-h-screen to h-screen and added overflow-hidden to lock parent viewport */
    <div
      className={`layout-shell relative flex h-screen w-full overflow-hidden bg-white text-gray-900 transition-colors dark:bg-[#080808] dark:text-gray-100 ${
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

      {/* h-full ensures content container matches parent height */}
      <div className="layout-content relative flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        
        {/* Header stays pinned at the top */}
        <Header
          isDarkMode={isDarkMode}
          isSidebarOpen={!isSidebarCollapsed}
          onToggleSidebar={() =>
            updateSidebarState(!isSidebarCollapsed)
          }
          onToggleTheme={toggleTheme}
        />

        {/* main container receives overflow-y-auto to allow children scroll only */}
        <main className="min-h-0 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}