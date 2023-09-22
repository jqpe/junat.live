import type { Locale } from '@typings/common'

export type LocalizedStation = {
  countryCode: string
  stationName: Record<Locale, string>
  stationShortCode: string
  longitude: number
  latitude: number
}

export type { DigitrafficError as ErrorType } from '@junat/digitraffic'
