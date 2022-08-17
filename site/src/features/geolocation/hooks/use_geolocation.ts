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

interface Props {
  translations: Translations
  locale: Locale
  setStations: (stations: LocalizedStation[]) => unknown
}

/**
 *
 */
export function useGeolocation(props: Props) {
  const { translations, locale, setStations } = props

  const { data: stations } = useStations()
  const router = useRouter()
  const toast = useToast(state => state.toast)

  const getCurrentPosition = React.useCallback(() => {
    if (typeof stations === 'undefined') {
      return
    }

    if (typeof window !== 'undefined') {
      const onSuccess: PositionCallback = position => {
        const station = getNearbyStations(position, {
          locale,
          stations
        })

        if (Array.isArray(station)) {
          setStations(station)

          toast(translations.badGeolocationAccuracy)
        } else {
          router.push(getStationPath(station.stationName[locale]))
        }
      }

      navigator.geolocation.getCurrentPosition(onSuccess, error => {
        toast(getError(error, translations))
      })
    }
  }, [locale, router, setStations, stations, toast, translations])

  return { getCurrentPosition }
}
