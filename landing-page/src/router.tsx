import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import Landing from './pages/landing'
import Pricing from './pages/pricing'
import Contact from './pages/contact'
import Demo from './pages/book-a-demo'
import AnnouncementBanner from './components/announcement-banner'
import Login from './pages/login'
import Header from './components/header'

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-black">
      <AnnouncementBanner />
      <Header />
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

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
})

const routeTree = rootRoute.addChildren([landingRoute, pricingRoute, contactRoute, demoRoute, loginRoute])

export const router = createRouter({
  routeTree,
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
