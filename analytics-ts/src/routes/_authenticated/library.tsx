import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/library')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>library</div>
}
