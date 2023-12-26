import type { LocalizedStation } from '@lib/digitraffic'
import type { Locale } from '@typings/common'

import React from 'react'

import { useRouter } from 'next/router'

import { getStationPath } from '~/lib/digitraffic'

import { useToast } from '@features/toast'

import translate from '@utils/translate'
import { getNearbyStations } from '../utils/get_nearby_stations'

type Translations = {
  geolocationPositionUnavailableError: string
  geolocationPositionTimeoutError: string
  geolocationPositionError: string
  badGeolocationAccuracy: string
}

const getError = (
  error: GeolocationPositionError,
  translations: Translations
) => {
  return (
    {
      [error.PERMISSION_DENIED]: translations.geolocationPositionError,
      [error.POSITION_UNAVAILABLE]:
        translations.geolocationPositionUnavailableError,

      [error.TIMEOUT]: translations.geolocationPositionTimeoutError
    }[error.code] || translations.geolocationPositionError
  )
}

export interface UseGeolocationProps {
  locale: Locale
  stations?: {
    latitude: number
    longitude: number
    stationName: Record<Locale, string>
  }[]
  setStations: (stations: LocalizedStation[]) => unknown
  onError?: (error: string) => unknown
}

let latestPosition: GeolocationPosition | undefined

/**
 * The callback can be used to get the current position.
 *
 * When the callback is called, this hook either calls `setStations`
 * with stations sorted by their distance to position and toasts about bad accuracy,
 * toasts an error if geolocation failed, or pushes a new route on to the stack.
 */
export const useGeolocation = ({
  locale,
  onError,
  setStations,
  stations
}: UseGeolocationProps) => {
  const t = translate(locale)
  const router = useRouter()

  const toast = useToast(state => state.toast)

  const getCurrentPosition = React.useCallback(() => {
    const translations: Translations = {
      badGeolocationAccuracy: t('errors', 'badGeolocationAccuracy'),
      geolocationPositionError: t('errors', 'positionError'),
      geolocationPositionTimeoutError: t('errors', 'positionTimeout'),
      geolocationPositionUnavailableError: t('errors', 'positionUnavailable')
    }

    handlePosition({
      locale,
      router,
      setStations,
      stations,
      toast,
      translations,
      onError
    })
  }, [locale, onError, router, setStations, stations, t, toast])

  return {
    getCurrentPosition,
    get latestPosition() {
      return latestPosition
    }
  }
}

type StationParams = {
  latitude: number
  longitude: number
  stationName: Record<Locale, string>
}

type HandlePositionProps<T extends StationParams> = UseGeolocationProps & {
  translations: Translations
  stations?: T[]
  toast: (title: string) => unknown
  router: { push: (route: string) => unknown }
}

/**
 * @private
 */
export function handlePosition<T extends StationParams>(
  props: HandlePositionProps<T>
) {
  const {
    locale,
    setStations,
    translations,
    stations,
    toast,
    router,
    onError: errorCallback
  } = props

  if (stations === undefined) {
    return
  }

  const onSuccess: PositionCallback = position => {
    const station = getNearbyStations(position, {
      locale,
      stations
    })

    if (Array.isArray(station)) {
      setStations(station as unknown as LocalizedStation[])

      toast(translations.badGeolocationAccuracy)
    } else {
      latestPosition = position
      const url = new URL(
        getStationPath(station.stationName[locale]) + `?geolocation=true`,
        window.origin
      )

      router.push(url.toString())
    }
  }

  const onError: PositionErrorCallback = error => {
    toast(getError(error, translations))
    errorCallback?.(getError(error, translations))
  }

  if (typeof window !== 'undefined') {
    navigator.geolocation.getCurrentPosition(onSuccess, onError)
  }
}
