import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import Landing from './pages/landing'
import Pricing from './pages/pricing'
import Contact from './pages/contact'
import Demo from './pages/book-a-demo'
import AnnouncementBanner from './components/announcement-banner'

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-black">
      <AnnouncementBanner />
      <Outlet />
    </div>
  ),
})

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Landing,
})

const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pricing',
  component: Pricing,
})

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: Contact,
})

const demoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/book-a-demo',
  component: Demo,
})

const routeTree = rootRoute.addChildren([landingRoute, pricingRoute, contactRoute, demoRoute])

export const router = createRouter({
  routeTree,
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
