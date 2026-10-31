import { createFileRoute } from '@tanstack/react-router'
import Refund from '../pages/refund'

export const Route = createFileRoute('/refund-policy')({
  component: Refund,
})
