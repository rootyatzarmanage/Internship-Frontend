import { Outlet } from '@tanstack/react-router'
import AnnouncementBanner from '../banner/announcement-banner'
import Footer from '../footer/footer'
import Header from '../header/header'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBanner />
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}
