import { createFileRoute } from '@tanstack/react-router'
import Demo from '../pages/book-a-demo'

export const Route = createFileRoute('/book-a-demo')({
  component: Demo,
})
