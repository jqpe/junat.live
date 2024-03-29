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

export interface LocalizedStation<
  Locale extends string,
  Proxy extends boolean = false
> extends Omit<Station, 'stationName'> {
  stationName: Record<Locale, Proxy extends true ? string : string | undefined>
}
