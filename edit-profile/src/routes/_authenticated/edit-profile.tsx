import { createFileRoute } from '@tanstack/react-router'
import App from '../../App'

export const Route = createFileRoute('/_authenticated/edit-profile')({
  component: App,
})