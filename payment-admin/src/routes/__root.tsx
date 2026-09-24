import { createRootRoute, Outlet } from '@tanstack/react-router'
import Layout from '../components/Layout'

export const Route = createRootRoute({
  component: RootLayout,

  notFoundComponent: () => (
    <div className="flex min-h-screen">
        <p className="p-4 text-gray-500">hello</p>
    </div>
  ),
})

function RootLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}