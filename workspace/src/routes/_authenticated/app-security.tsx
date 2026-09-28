import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/app-security')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/app-security"!</div>
}
