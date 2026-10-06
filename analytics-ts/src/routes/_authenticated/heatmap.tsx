import { createFileRoute } from '@tanstack/react-router'
import Heatmap from '../../features/analytics/heatmap'

export const Route = createFileRoute('/_authenticated/heatmap')({
  component: Heatmap,
})