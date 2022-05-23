export interface Wagon {
  vehicleNumber?: number
  location: number
  salesNumber: number
  length?: number
  playground?: boolean
  pet?: boolean
  catering?: boolean
  video?: boolean
  luggage?: boolean
  smoking?: boolean
  disabled?: boolean
  /**
   * @see https://fi.wikipedia.org/wiki/Sarjatunnus
   */
  wagonType?: string
}
