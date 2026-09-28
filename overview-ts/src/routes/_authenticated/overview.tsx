import { createFileRoute } from '@tanstack/react-router'
import Overview from '../../features/overview/index'

export const Route = createFileRoute('/_authenticated/overview')({
  component: Overview,
})