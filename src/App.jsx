import Sidebar from './Dashboard/Sidebar'
import Header from './Dashboard/Header'

function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Header />
      </main>
    </div>
  )
}

export default App
