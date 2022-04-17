import type { LocalizedStation, Station } from '~digitraffic'
import type { NextRouter } from 'next/router'

import getNearestStation from '@utils/get_nearest_station'
import { useMemo } from 'react'
import { getStationPath } from '~digitraffic'

interface UseNearestStationRouteProps<
  StationType extends LocalizedStation | Station
> {
  position?: GeolocationPosition
  locale?: 'fi' | 'en' | 'sv'
  stations: StationType[]
  router: NextRouter
}

/**
 * Navigates to the nearest station when `position` is defined. If `stations` is an array of `LocalizedStations` `locale` needs to be defined as well.
 */
export default function useNearestStationRoute<
  StationType extends LocalizedStation | Station
>({
  locale,
  position,
  router,
  stations
}: UseNearestStationRouteProps<StationType>) {
  useMemo(() => {
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
  }, [position, locale, stations, router])
}
