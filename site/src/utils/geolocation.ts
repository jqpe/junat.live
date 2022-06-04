import type { NextRouter } from 'next/router'
import type { LocalizedStation, Station } from '@junat/digitraffic/types'

import { getStationPath } from '@junat/digitraffic/utils'

import getNearestStation from '@utils/get_nearest_station'

interface HandleGeolocationPosition {
  (
    position: GeolocationPosition,
    opts: { stations: Station[]; router: NextRouter }
  ): void
  (
    position: GeolocationPosition,
    opts: {
      stations: LocalizedStation[]
      router: NextRouter
      locale: 'fi' | 'en' | 'sv'
    }
  ): void
}

export const handleGeolocationPosition: HandleGeolocationPosition = (
  position,
  opts
) => {
  if (!position) {
    return
  }

  const nearestStation = getNearestStation<typeof opts.stations[number]>(
    opts.stations,
    position
  )

  if (typeof nearestStation.stationName === 'string') {
    opts.router.push(`/${getStationPath(nearestStation.stationName)}`)
    return
  }

  if (!('locale' in opts)) {
    return
  }

  opts.router.push(getStationPath(nearestStation.stationName[opts.locale]))
}
