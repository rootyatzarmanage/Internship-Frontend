import { useEffect, useState } from 'react'
import Sidebar from './Components/layout/Sidebar/Sidebar'
import Header from './Components/layout/Header/Header'
import Page from './Components/overview/Page'
import { useTheme } from './Components/theme/theme'
import './App.css'

const SIDEBAR_STORAGE_KEY = 'overview-sidebar-collapsed'

function App() {
  const { isDarkMode, toggleTheme } = useTheme()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => (
    window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true'
  ))

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isSidebarCollapsed))
  }, [isSidebarCollapsed])

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev)
  }

  return (
    <div className="overview-shell flex h-screen min-h-0 overflow-hidden bg-white text-gray-900 transition-colors dark:bg-[#080808] dark:text-gray-100">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      {!isSidebarCollapsed && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="overview-sidebar-backdrop"
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#f7f7f7] transition-colors dark:bg-[#0d0d0d]">
        <Header isDarkMode={isDarkMode} onToggleSidebar={handleToggleSidebar} onToggleTheme={toggleTheme} />
        <Page />
      </main>
    </div>
  )
}

export default App
