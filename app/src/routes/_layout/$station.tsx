import { createFileRoute } from '@tanstack/react-router'

import { Station } from '~/features/pages/station'
import stations from '~/stations.json'

export const Route = createFileRoute('/_layout/$station')({
  loader(ctx) {
    return stations.find(
      station => station.stationShortCode === ctx.params.station,
    )
  },
  component: () => {
    const station = Route.useLoaderData()

    if (!station) {
      return null
    }

    return <Station station={station} />
  },
})
