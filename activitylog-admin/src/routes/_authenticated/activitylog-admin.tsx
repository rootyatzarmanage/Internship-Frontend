import { createFileRoute } from '@tanstack/react-router'
import { ActivityLog } from '../../features/activitylog-admin'

export const Route = createFileRoute('/_authenticated/activitylog-admin')({
  component: ActivityLog,
})