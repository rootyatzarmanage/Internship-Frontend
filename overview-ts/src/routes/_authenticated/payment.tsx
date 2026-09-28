import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/payment')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>payment</div>
}
