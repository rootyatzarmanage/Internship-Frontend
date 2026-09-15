import { useState } from 'react'
import Dashboard from './pages/Dashboard'

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev)
  }

  return (
    <Dashboard
      isSidebarCollapsed={isSidebarCollapsed}
      onToggleSidebar={handleToggleSidebar}
    />
  )
}

export default App