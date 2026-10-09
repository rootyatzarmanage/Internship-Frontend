import { createFileRoute } from '@tanstack/react-router'
import { Help } from '../../features/help/index'

export const Route = createFileRoute('/_authenticated/help')({
  component: Help,
})