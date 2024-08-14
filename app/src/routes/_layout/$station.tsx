import { createFileRoute, notFound } from '@tanstack/react-router'

import { getStationPath } from '@junat/digitraffic'

import { Station } from '~/features/pages/station'
import stations from '~/stations.json'

export const Route = createFileRoute('/_layout/$station')({
  loader(ctx) {
    const station = stations.find(station => {
      return getStationPath(station.stationName.en) === ctx.params.station
    })

    if (!station) throw notFound()

    return station
  },
  component: () => {
    const station = Route.useLoaderData()

    return <Station station={station} />
  },
})
