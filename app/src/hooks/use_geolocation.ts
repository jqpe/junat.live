import type { errors } from '@junat/i18n/en.json'
import type { LocalizedStation } from '~/lib/digitraffic'
import type { Locale } from '~/types/common'

import React from 'react'
import { getCurrentPosition } from '@tauri-apps/plugin-geolocation'

import { getStationsSortedByDistance } from '@junat/core/geolocation'

import { translate } from '~/i18n'

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
  error: GeolocationPositionError | number,
  translations: Translations,
): GeolocationError => {
  const errorMessages: Record<number, keyof Translations> = {
    [GeolocationPositionError.PERMISSION_DENIED]: 'positionError',
    [GeolocationPositionError.POSITION_UNAVAILABLE]: 'positionUnavailable',
    [GeolocationPositionError.TIMEOUT]: 'positionTimeout',
  }

  const code = typeof error === 'number' ? error : error.code
  const messageKey = errorMessages[code] || 'positionError'

  return {
    localizedErrorMessage: translations[messageKey],
    code,
  }
}

export interface UseGeolocationProps {
  locale: Locale
  stations?: {
    latitude: number
    longitude: number
    stationName: Record<Locale, string>
  }[]
  onSuccess?: (position: GeolocationPosition) => unknown
  onStations?: (stations: LocalizedStation[]) => unknown
  onError?: (error: GeolocationError) => unknown
}

/**
 * Provides a callback to get the user's current position and triggers success or error callbacks based on the result.
 */
export const useGeolocation = ({
  locale,
  onError,
  onStations,
  stations,
  onSuccess,
}: UseGeolocationProps) => {
  const t = translate(locale)

  const getCurrentPosition = React.useCallback(() => {
    const translations: Translations = t('errors')

    handlePosition({
      locale,
      onStations,
      stations,
      translations,
      onSuccess,
      onError,
    })
  }, [locale, onError, onStations, onSuccess, stations, t])

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

  const onError: PositionErrorCallback = async error => {
    // iOS denied permission
    if (typeof error === 'string' && /kCLErrorDomain error 1/.test(error)) {
      props.onError?.(
        getError(GeolocationPositionError.PERMISSION_DENIED, translations),
      )
      return
    }

    props.onError?.(getError(error, translations))
  }

  getCurrentPosition({
    enableHighAccuracy: true, // prefer GPS
    maximumAge: 0,
    timeout: 10_000,
  }).then(result => {
    switch (result.status) {
      case 'ok':
        onSuccess(result.data)
        break
      case 'error':
        onError(result.error)
    }
  })
}
