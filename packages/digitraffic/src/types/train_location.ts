export interface TrainLocation {
  trainNumber: number
  departureDate: string
  timestamp: string
  location: {
    type: 'Point'
    coordinates: [number, number]
  }
  speed: number
  accuracy: number | null
}
