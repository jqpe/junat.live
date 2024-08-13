import { writeFileSync } from 'node:fs'

import { INACTIVE_STATIONS } from '@junat/core'
import { fetchStations } from '@junat/digitraffic'

import { stations as fiStations} from  '@junat/i18n/fi.json' assert {type: "json"}
import { stations as enStations} from  '@junat/i18n/en.json' assert {type: "json"}
import { stations as svStations } from  '@junat/i18n/sv.json' assert {type: "json"}



const stations = await fetchStations({
  betterNames: true,
  inactiveStations: INACTIVE_STATIONS,
  i18n: {
    fi: fiStations,
    en: enStations,
    sv: svStations,
  },
})

writeFileSync('./src/stations.json', JSON.stringify(stations), {
  encoding: 'utf-8',
})
