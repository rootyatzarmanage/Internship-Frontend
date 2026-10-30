import { createFileRoute } from '@tanstack/react-router'
import Pricing from '../pages/pricing'

export const Route = createFileRoute('/pricing')({
  component: Pricing,
})
