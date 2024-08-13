import { createFileRoute } from '@tanstack/react-router'

import { Settings } from '~/features/pages/settings'

export const Route = createFileRoute('/_layout/settings')({
  component: Settings,
})
