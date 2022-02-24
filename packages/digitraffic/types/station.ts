export interface Station {
  passengerTraffic: boolean
  type: 'STATION' | 'STOPPING_POINT' | 'TURNOUT_IN_THE_OPEN_LINE'
  stationName: string
  stationShortCode: string
  stationUICCode: number
  countryCode: 'FI' | 'RU'
  longitude: number
  latitude: number
}

export interface LocalizedStation extends Omit<Station, 'stationName'> {
  stationName: Partial<Record<'fi' | 'en' | 'sv', string>>
}
