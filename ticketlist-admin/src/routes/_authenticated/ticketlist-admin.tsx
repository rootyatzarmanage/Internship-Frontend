import { createFileRoute } from '@tanstack/react-router'
import App from '../../features/ticketlist-admin'

export const Route = createFileRoute('/_authenticated/ticketlist-admin')({
  component: App,
})