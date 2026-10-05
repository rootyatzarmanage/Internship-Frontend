import { createFileRoute } from '@tanstack/react-router'
import Analytics from '../../features/analytics/heatmap'

export const Route = createFileRoute('/_authenticated/analytics')({
  component: Analytics,
})