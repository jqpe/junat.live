import type { LOCALES } from '@junat/core/constants'
import type { LocalizedStation } from '@junat/core/types'
import type { errors } from '@junat/i18n/en.json'

import React from 'react'

import { getStationsSortedByDistance } from '@junat/core/geolocation'

type Locale = (typeof LOCALES)[number]

type Translations = Pick<
  typeof errors,
  | 'badGeolocationAccuracy'
  | 'positionUnavailable'
  | 'positionError'
  | 'positionTimeout'
>

type GeolocationError = {
  code: number
  localizedErrorMessage: string
}

/**
 * Converts a GeolocationPositionError into a `GeolocationError` with a translated error message.
 */
const getError = (
  error: GeolocationPositionError,
  translations: Translations,
): GeolocationError => {
  const localizedErrorMessage =
    {
      [error.PERMISSION_DENIED]: translations.positionError,
      [error.POSITION_UNAVAILABLE]: translations.positionUnavailable,

      [error.TIMEOUT]: translations.positionTimeout,
    }[error.code] || translations.positionError

  return { localizedErrorMessage, code: error.code }
}

export interface UseGeolocationProps {
  locale: Locale
  translations: Translations
  stations?: LocalizedStation[]
  onSuccess?: (position: GeolocationPosition) => unknown
  onStations?: (stations: LocalizedStation[]) => unknown
  onError?: (error: GeolocationError) => unknown
}

/**
 * Provides a callback to get the user's current position and triggers success or error callbacks based on the result.
 */
export const useGeolocation = ({
  locale,
  translations,
  onError,
  onStations,
  stations,
  onSuccess,
}: UseGeolocationProps) => {
  const getCurrentPosition = React.useCallback(() => {
    handlePosition<LocalizedStation>({
      locale,
      onStations,
      stations,
      translations,
      onSuccess,
      onError,
    })
  }, [locale, onError, onStations, onSuccess, stations, translations])

  return {
    getCurrentPosition,
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
}

/**
 * Handles geolocation requests using the Geolocation API.  Triggers success or error callbacks
 * based on the outcome.
 */
export function handlePosition<T extends StationParams>(
  props: HandlePositionProps<T>,
) {
  const { translations, stations, onStations } = props

  if (stations === undefined) {
    return
  }

  const onSuccess: PositionCallback = position => {
    props.onSuccess?.(position)

    const nearbyStations = getStationsSortedByDistance({
      position,
      stations,
    })

    onStations?.(nearbyStations as unknown[] as LocalizedStation[])
  }

  const onError: PositionErrorCallback = error => {
    props.onError?.(getError(error, translations))
  }

  if (typeof window !== 'undefined') {
    navigator.geolocation.getCurrentPosition(onSuccess, onError)
  }
}
