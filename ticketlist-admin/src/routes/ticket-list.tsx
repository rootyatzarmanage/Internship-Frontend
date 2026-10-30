import { createFileRoute } from '@tanstack/react-router'
import TicketListAdmin from '../features/ticket-list'

export const Route = createFileRoute('/ticket-list')({
  component: TicketListAdmin,
})
