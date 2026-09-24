import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/workspace')({
  component: WorkspacePage,
})

function WorkspacePage() {
  return <div>Workspace</div>
}