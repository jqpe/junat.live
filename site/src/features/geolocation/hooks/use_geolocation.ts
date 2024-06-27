import type { LocalizedStation } from '~/lib/digitraffic'
import type { Locale } from '~/types/common'

import React from 'react'

import { translate } from '~/utils/translate'
import { getNearbyStations } from '../utils/get_nearby_stations'

type Translations = {
  geolocationPositionUnavailableError: string
  geolocationPositionTimeoutError: string
  geolocationPositionError: string
  badGeolocationAccuracy: string
}

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
      [error.PERMISSION_DENIED]: translations.geolocationPositionError,
      [error.POSITION_UNAVAILABLE]:
        translations.geolocationPositionUnavailableError,

      [error.TIMEOUT]: translations.geolocationPositionTimeoutError,
    }[error.code] || translations.geolocationPositionError

  return { localizedErrorMessage, code: error.code }
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
    const translations: Translations = {
      badGeolocationAccuracy: t('errors.badGeolocationAccuracy'),
      geolocationPositionError: t('errors.positionError'),
      geolocationPositionTimeoutError: t('errors.positionTimeout'),
      geolocationPositionUnavailableError: t('errors.positionUnavailable'),
    }

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
  const { locale, translations, stations, onStations } = props

  if (stations === undefined) {
    return
  }

  const onSuccess: PositionCallback = position => {
    props.onSuccess?.(position)

    const nearbyStations = getNearbyStations(position, {
      locale,
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
