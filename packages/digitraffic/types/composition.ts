import type { Locomotive } from './locomotive'
import type { Wagon } from './wagon'

export interface JourneyTimetableRow {
  stationShortCode: string
  stationUICCode: number
  countryCode: 'FI' | 'RU'
  type: 'DEPARTURE' | 'ARRIVAL'
  scheduledTime: string
}

export interface JourneySection {
  beginTimeTableRow: JourneyTimetableRow
  endTimeTableRow: JourneyTimetableRow
  locomotives: Locomotive[]
  wagons: Wagon[]
  totalLength: number
  maximumSpeed: number
}

export interface Composition {
  trainNumber: number
  departureDate: string
  operatorUICCode: number
  operatorShortCode: string
  trainCategory: string
  trainType: string
  version: number
  journeySections: JourneySection[]
}
