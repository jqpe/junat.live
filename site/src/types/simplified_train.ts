/**
 * Train type that only contains application critical properties.
 *
 * Storing full `Train`s get's expensive when they're cached in memory by Redux.
 */
export interface SimplifiedTrain {
  destination: Record<'fi' | 'en' | 'sv', string>
  departureDate: string
  scheduledTime: string
  liveEstimateTime?: string
  track?: string
  commuterLineID?: string
  trainNumber: number
  trainType: string
  version: number
}
