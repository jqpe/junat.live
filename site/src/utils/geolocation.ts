import type { NextRouter } from 'next/router'
import type { LocalizedStation, Station } from '@junat/digitraffic/lib/types'

import { getStationPath } from '@junat/digitraffic/lib/utils'

import getNearestStation from '@utils/get_nearest_station'

interface PositionHandlerArguments<
  StationType extends LocalizedStation | Station
> {
  stations: StationType[]
  router: NextRouter
  locale: 'fi' | 'en' | 'sv'
}

export const handleGeolocationPosition = (position: GeolocationPosition) => {
  return function handler<StationType extends LocalizedStation | Station>({
    stations,
    router,
    locale
  }: PositionHandlerArguments<StationType>) {
    if (!position) {
      return
    }

    const nearestStation = getNearestStation(stations, position)

    if (typeof nearestStation.stationName === 'string') {
      router.push(`/${getStationPath(nearestStation.stationName)}`)
      return
    }

    if (!locale) {
      return
    }

    router.push(getStationPath(nearestStation.stationName[locale]))
  }
}
