import { createFileRoute } from '@tanstack/react-router'
import error from '../../features/error/index'

export const Route = createFileRoute('/_authenticated/404')({
  component: error,
})