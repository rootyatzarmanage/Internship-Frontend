import { createFileRoute } from '@tanstack/react-router'
import { ContentEditor } from '../../features/controlpanel-admin'

export const Route = createFileRoute('/_authenticated/controlpanel-admin')({
  component: ContentEditor,
})

