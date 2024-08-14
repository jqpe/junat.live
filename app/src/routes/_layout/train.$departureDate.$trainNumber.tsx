import { createFileRoute } from '@tanstack/react-router'

import { TrainPage } from '~/features/pages/single_train'

export const Route = createFileRoute(
  '/_layout/train/$departureDate/$trainNumber',
)({
  component: () => {
    return <TrainPage />
  },
})
