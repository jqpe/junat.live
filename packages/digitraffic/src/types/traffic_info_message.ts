export interface TrafficInfoMessage {
  id: number
  version: number
  trainNumber: string
  departureDate?: string
  timestamp: string
  trackSection: string
  nextTrackSection?: string
  previousTrackSection?: string
  station: string
  nextStation?: string
  previousStation?: string
  type: 'OCCUPY' | 'RELEASE'
}
