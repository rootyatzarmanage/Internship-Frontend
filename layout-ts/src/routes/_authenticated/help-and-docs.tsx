import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/help-and-docs')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>help-and-docs</div>
}
