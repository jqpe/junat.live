import { createFileRoute } from '@tanstack/react-router'

import { Station } from '~/features/pages/station'

export const Route = createFileRoute('/_layout/$station')({
  component: Station,
})
