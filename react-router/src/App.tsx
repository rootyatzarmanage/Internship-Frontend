import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Analytics from './pages/analytics'
import Workspace from './pages/workspace'
import Resources from './pages/resources'
import Payment from './pages/payment'
import Library from './pages/library'
import Subscription from './pages/subscription'
import AppSecurity from './pages/app-security'
import HelpAndDocs from './pages/help-and-docs'

import './App.css'

function App() {
  return (
      <Routes>
        <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/analytics" replace />} />

        <Route path="/analytics" element={<Analytics />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/library" element={<Library />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/app-security" element={<AppSecurity />} />
        <Route path="/help-and-docs" element={<HelpAndDocs />} />
        </Route>
      </Routes>
  )
}

export default App