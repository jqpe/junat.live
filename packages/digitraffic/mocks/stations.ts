export const stations = [
  /** Inactive station shortcodes */
  {
    passengerTraffic: true,
    type: 'STOPPING_POINT',
    stationName: 'Haksi',
    stationShortCode: 'HSI',
    stationUICCode: 1015,
    countryCode: 'FI',
    longitude: 25.554_663,
    latitude: 60.408_207,
  },
  {
    passengerTraffic: true,
    type: 'STOPPING_POINT',
    stationName: 'Hinthaara',
    stationShortCode: 'HH',
    stationUICCode: 561,
    countryCode: 'FI',
    longitude: 25.477_951,
    latitude: 60.399_764,
  },
  {
    passengerTraffic: true,
    type: 'STOPPING_POINT',
    stationName: 'Kiiala',
    stationShortCode: 'KIA',
    stationUICCode: 1113,
    countryCode: 'FI',
    longitude: 25.613_204,
    latitude: 60.406_719,
  },
  {
    passengerTraffic: false,
    type: 'STATION',
    stationName: 'Kyrö',
    stationShortCode: 'KÖ',
    stationUICCode: 139,
    countryCode: 'FI',
    longitude: 22.748_862,
    latitude: 60.702_716,
  },
  {
    passengerTraffic: true,
    type: 'STATION',
    stationName: 'Lievestuore',
    stationShortCode: 'LVT',
    stationUICCode: 246,
    countryCode: 'FI',
    longitude: 26.195_893,
    latitude: 62.259_872,
  },
  {
    passengerTraffic: true,
    type: 'STOPPING_POINT',
    stationName: 'Nikkilä',
    stationShortCode: 'NLÄ',
    stationUICCode: 22,
    countryCode: 'FI',
    longitude: 25.266_54,
    latitude: 60.382_37,
  },
  {
    passengerTraffic: true,
    type: 'STATION',
    stationName: 'Porvoo',
    stationShortCode: 'PRV',
    stationUICCode: 23,
    countryCode: 'FI',
    longitude: 25.648_462,
    latitude: 60.396_602,
  },
  /** i18n */
  {
    passengerTraffic: true,
    type: 'STATION',
    stationName: 'Järvenpää asema',
    stationShortCode: 'JP',
    stationUICCode: 25,
    countryCode: 'FI',
    longitude: 25.090_796,
    latitude: 60.473_684,
  },
  {
    passengerTraffic: false,
    type: 'TURNOUT_IN_THE_OPEN_LINE',
    stationName: 'Dynamiittivaihde',
    stationShortCode: 'DMV',
    stationUICCode: 581,
    countryCode: 'FI',
    longitude: 23.084_138,
    latitude: 59.866_408,
  },
  {
    passengerTraffic: true,
    type: 'STATION',
    stationName: 'Pasila autojuna-asema',
    stationShortCode: 'PAU',
    stationUICCode: 1328,
    countryCode: 'FI',
    longitude: 24.933_169,
    latitude: 60.208_303,
  },
]

export const i18n = {
  en: {
    PAU: 'Pasila car-carrier station',
    PNÄ: 'Pietarsaari-Pedersöre',
    PTL: 'St. Petersburg (Ladozhki)',
    PTR: 'St. Petersburg (Finljandski)',
    MVA: 'Moscow',
    VYB: 'Vyborg',
    OVK: 'Orivesi center',
    KTS: 'Kotka port',
    TOR: 'Tornio centre',
    EPZ: 'Ähtäri Eläinpuisto-Zoo',
    TUS: 'Turku port',
    LEN: 'Helsinki airport',
  },
}
