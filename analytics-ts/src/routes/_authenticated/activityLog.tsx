import { createFileRoute } from '@tanstack/react-router'
import ActivityLog from '../../features/analytics/activityLog'

export const Route = createFileRoute('/_authenticated/activityLog')({
  component: ActivityLog,
})