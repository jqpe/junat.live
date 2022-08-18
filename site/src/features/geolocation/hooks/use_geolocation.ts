import type { LocalizedStation } from '@junat/digitraffic/types'
import type { Locale } from '@typings/common'

import React from 'react'

import { useRouter } from 'next/router'

import { getStationPath } from '@junat/digitraffic/utils'

import { useToast } from '@features/toast'
import { useStations } from '@hooks/use_stations'

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
  translations: Translations
  locale: Locale
  setStations: (stations: LocalizedStation[]) => unknown
}

/**
 * The callback can be used to get the current position.
 *
 * When the callback is called, this hook either calls `setStations`
 * with stations sorted by their distance to position and toasts about bad accuracy,
 * toasts an error if geolocation failed, or pushes a new route on to the stack.
 */
export const useGeolocation = (props: UseGeolocationProps) => {
  const { translations, locale, setStations } = props

  const { data: stations } = useStations()
  const router = useRouter()
  const toast = useToast(state => state.toast)

  const getCurrentPosition = React.useCallback(() => {
    handlePosition({
      locale,
      router,
      setStations,
      stations,
      toast,
      translations
    })
  }, [locale, router, setStations, stations, toast, translations])

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
  router
}: UseGeolocationProps & {
  stations?: T[]
  toast: (title: string) => unknown
  router: { push: (route: string) => unknown }
}) {
  if (typeof stations === 'undefined') {
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
  }

  if (typeof window !== 'undefined') {
    navigator.geolocation.getCurrentPosition(onSuccess, onError)
  }
}
