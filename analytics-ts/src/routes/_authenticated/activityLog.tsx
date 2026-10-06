import { createFileRoute } from '@tanstack/react-router'
import ActivityLog from '../../pages/activityLog'

export const Route = createFileRoute('/_authenticated/activityLog')({
  component: ActivityLog,
})