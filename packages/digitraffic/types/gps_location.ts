export interface GpsLocation {
  trainNumber: number
  departureDate: string
  timestamp?: string
  location: {
    type: 'Point'
    coordinates: [number, number]
  }
  speed: number
}
