import { createFileRoute, Outlet } from '@tanstack/react-router'
import Layout from '../../components/Layout'

export const Route = createFileRoute('/_authenticated/route copy')({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
})