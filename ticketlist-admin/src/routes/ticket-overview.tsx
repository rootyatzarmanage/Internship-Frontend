import { createFileRoute } from '@tanstack/react-router'
import TicketOverview from '../features/ticket-overview'

export const Route = createFileRoute('/ticket-overview')({
  component: TicketOverview,
})
