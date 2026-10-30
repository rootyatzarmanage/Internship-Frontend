import { useNavigate } from '@tanstack/react-router'
import TicketListAdmin from '../ticket-list'

/* The reference design creates tickets in a popup on the list screen, so /ticketlist/create
   opens the list with that popup already showing. */
export default function CreateTicket() {
  const navigate = useNavigate()
  return <TicketListAdmin createOpen onCreateClose={() => navigate({ to: '/ticket-list' })} />
}
