import { writeFileSync } from 'node:fs'

import { INACTIVE_STATIONS } from '@junat/core'
import { fetchStations } from '@junat/digitraffic'

import fi from  '@junat/i18n/fi.json' with {type: 'json'}
import en from  '@junat/i18n/en.json' with {type: 'json'}
import sv from  '@junat/i18n/sv.json' with {type: 'json'}



const stations = await fetchStations({
  betterNames: true,
  inactiveStations: INACTIVE_STATIONS,
  proxy: true,
  i18n: {
    fi: fi.stations,
    en: en.stations,
    sv: sv.stations,
  },
})

writeFileSync('./src/stations.json', JSON.stringify(stations), {
  encoding: 'utf8',
})
