import { createFileRoute } from '@tanstack/react-router'
import Terms from '../pages/terms'

export const Route = createFileRoute('/terms-of-use')({
  component: Terms,
})
