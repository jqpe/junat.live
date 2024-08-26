import { createFileRoute } from '@tanstack/react-router'

import { Home } from '~/features/pages/home'

export const Route = createFileRoute('/_layout/')({
  component: Home,
})
