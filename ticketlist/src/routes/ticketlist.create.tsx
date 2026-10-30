import { createFileRoute } from '@tanstack/react-router'
import CreateTicket from '../features/create-ticket'

export const Route = createFileRoute('/ticketlist/create')({
  component: CreateTicket,
})
