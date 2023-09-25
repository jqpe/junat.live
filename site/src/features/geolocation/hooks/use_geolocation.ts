import type { LocalizedStation } from '@lib/digitraffic'
import type { Locale } from '@typings/common'

import React from 'react'

import { useRouter } from 'next/router'

import { getStationPath, useStations } from '~/lib/digitraffic'

import { useToast } from '@features/toast'

import { getNearbyStations } from '../utils/get_nearby_stations'
import translate from '@utils/translate'

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
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return translations.geolocationPositionError

    case error.POSITION_UNAVAILABLE:
      return translations.geolocationPositionUnavailableError

    case error.TIMEOUT:
      return translations.geolocationPositionTimeoutError

    default:
      return translations.geolocationPositionError
  }
}

export interface UseGeolocationProps {
  locale: Locale
  setStations: (stations: LocalizedStation[]) => unknown
  onError?: (error: string) => unknown
}

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
  setStations
}: UseGeolocationProps) => {
  const t = translate(locale)

  const { data: stations } = useStations()
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

  return { getCurrentPosition }
}

/**
 * @private
 */
export function handlePosition<
  T extends {
    latitude: number
    longitude: number
    stationName: Record<Locale, string>
  }
>({
  locale,
  setStations,
  translations,
  stations,
  toast,
  router,
  onError: errorCallback
}: UseGeolocationProps & {
  translations: Translations
  stations?: T[]
  toast: (title: string) => unknown
  router: { push: (route: string) => unknown }
}) {
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
      router.push(getStationPath(station.stationName[locale]))
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
