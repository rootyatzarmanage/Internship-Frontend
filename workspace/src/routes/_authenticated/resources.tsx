import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/resources')({
  component: ResourcePage,
})

function ResourcePage() {
  return <div>Resource</div>
}