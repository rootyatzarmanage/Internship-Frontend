import { createFileRoute } from '@tanstack/react-router'
import TicketSettings from '../features/ticket-settings'

export const Route = createFileRoute('/ticket-settings')({
  component: TicketSettings,
})
