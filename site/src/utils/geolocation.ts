import type { NextRouter } from 'next/router'
import type { LocalizedStation, Station } from '@junat/digitraffic/types'

import { getStationPath } from '@junat/digitraffic/utils'

import getNearestStation from '@utils/get_nearest_station'

type Opts<TStation extends LocalizedStation | Station> = {
  stations: TStation[]
  router: NextRouter
}

export const handleGeolocationPosition = <
  TStation extends LocalizedStation | Station
>(
  position: GeolocationPosition,
  {
    router,
    stations,
    locale
  }: TStation extends LocalizedStation
    ? Opts<TStation> & { locale: 'fi' | 'en' | 'sv' }
    : Opts<TStation> & { locale?: never }
) => {
  if (!position) {
    return
  }

  const nearestStation = getNearestStation<typeof stations[number]>(
    stations,
    position
  )

  if (typeof nearestStation.stationName === 'string') {
    router.push(`/${getStationPath(nearestStation.stationName)}`)
    return
  }

  if (!locale) {
    return
  }

  router.push(getStationPath(nearestStation.stationName[locale]))
}
