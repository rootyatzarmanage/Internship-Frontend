import { createFileRoute } from '@tanstack/react-router'
import Heatmap from '../../pages/heatmap'

export const Route = createFileRoute('/_authenticated/heatmap')({
  component: Heatmap,
})