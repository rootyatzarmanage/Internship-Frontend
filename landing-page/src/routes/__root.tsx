import { createRootRoute, Outlet } from '@tanstack/react-router'
import AnnouncementBanner from '../components/banner/announcement-banner'
import Header from '../components/header/header'

function RootLayout() {
  return (
    <div className="min-h-screen bg-black">
      <AnnouncementBanner />
      <Header />
      <Outlet />
    </div>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
