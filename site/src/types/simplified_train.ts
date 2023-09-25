import type { Locale } from './common'

/**
 * Train type that only contains properties used in the application.
 */
export interface SimplifiedTrain {
  destination: Record<Locale, string>
  departureDate: string
  scheduledTime: string
  liveEstimateTime?: string
  commercialStop?: boolean
  track?: string
  cancelled: boolean
  commuterLineID?: string
  trainNumber: number
  trainType: string
  version: number
}
