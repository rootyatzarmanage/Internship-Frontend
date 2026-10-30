import { createFileRoute } from '@tanstack/react-router'
import TicketReply from '../features/ticket-reply'

export const Route = createFileRoute('/ticketlist/reply')({
  validateSearch: (search: Record<string, unknown>) => ({
    ticketId: typeof search.ticketId === 'string' ? search.ticketId : '',
  }),
  component: TicketReplyRoute,
})

function TicketReplyRoute() {
  const { ticketId } = Route.useSearch()
  return <TicketReply key={ticketId} ticketId={ticketId} />
}
