import type { Locale } from '~/types/common'

export type LocalizedStation = {
  countryCode: string
  stationName: Record<Locale, string>
  stationShortCode: string
  longitude: number
  latitude: number
}
