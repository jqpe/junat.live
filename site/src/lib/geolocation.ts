import type { NextRouter } from 'next/router'
import { getStationPath, LocalizedStation, Station } from '~digitraffic'

import getNearestStation from '@utils/get_nearest_station'

interface ErrorHandlerArguments {
  errors: {
    permissionDenied: string
    timeout: string
    unavailable: string
  }
  callback: (title: string) => void
}

export const handleGeolocationError = (error: GeolocationPositionError) => {
  return function handler({ errors, callback }: ErrorHandlerArguments) {
    const title = (() => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          return errors.permissionDenied
        case error.TIMEOUT:
          return errors.timeout
        default:
          return errors.unavailable
      }
    })()

    callback(title)
  }
}

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
