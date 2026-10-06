import { createFileRoute } from '@tanstack/react-router'
import Analytics from '../../features/analytics/index'

export const Route = createFileRoute('/_authenticated/analytics')({
  component: Analytics,
})