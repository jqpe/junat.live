import type { LOCALES } from '@junat/core/constants'

type Locale = (typeof LOCALES)[number]

export type LocalizedStation = {
  countryCode: string
  stationName: Record<Locale, string>
  stationShortCode: string
  longitude: number
  latitude: number
}
