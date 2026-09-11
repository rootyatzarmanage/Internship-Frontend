import { useState } from 'react'
import Sidebar from './Components/layout/Sidebar'
import Header from './Components/layout/Header'

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <main className="flex-1">
        <Header onToggleSidebar={handleToggleSidebar} />
      </main>
    </div>
  )
}

export default App