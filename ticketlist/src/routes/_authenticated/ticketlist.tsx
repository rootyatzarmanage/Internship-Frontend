import { createFileRoute } from '@tanstack/react-router'
import App from '../../features/ticketlist'

export const Route = createFileRoute('/_authenticated/ticketlist')({
  component: App,
})