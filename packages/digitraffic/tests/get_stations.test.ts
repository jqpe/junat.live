import { inactiveStationShortCodes } from '../src/get_stations'
import { describe, expect, it } from 'vitest'
import { LocalizedStation } from '../types/station'

// See generators/fixtures.ts to see how these are generated.
// Run yarn generate:fixtures to purge old fixtures and generate new ones.

import enStations from './fixtures/enStations.json'
import localizedStations from './fixtures/localizedStations.json'
import svStations from './fixtures/svStations.json'

import nonInactiveStations from './fixtures/nonInactiveStations.json'
import nonPassengerStations from './fixtures/nonPassengerStations.json'
import stations from './fixtures/stations.json'
import { tweakStationNames } from '../src/tweak_station_names'

describe('get stations', () => {
  it("doesn't contain inactive stations by default", () => {
    const stationShortCodes = nonInactiveStations.map(
      station => station.stationShortCode
    )

    expect(stationShortCodes).not.to.include.members(inactiveStationShortCodes)
  })

  it('includes inactive stations if omit inactive stations is false', () => {
    const stationShortCodes = stations.map(station => station.stationShortCode)

    expect(stationShortCodes).to.include.members(inactiveStationShortCodes)
  })

  it("doesn't include non passenger stations if include passenger stations is false", () => {
    expect(
      nonPassengerStations.map(station => station.passengerTraffic)
    ).not.to.include(false)
  })

  describe('i18n', () => {
    describe('english (en)', () => {
      const englishStationNames = enStations.map(
        station => station.stationName.en
      )

      it('includes english station names when locale is set to english (en)', () => {
        expect(englishStationNames).to.include('Pasila car-carrier station')
      })

      it('includes finnish station names if there is no translation for english', () => {
        expect(englishStationNames).to.include('Järvenpää')
      })
    })

    describe('swedish (sv)', () => {
      const swedishStationNames = svStations.map(
        station => station.stationName.sv
      )

      it('includes swedish station names when locale is set to swedish (sv)', () => {
        expect(swedishStationNames).to.include('Träskända')
      })

      it('includes finnish station names if there is no translation for swedish', () => {
        expect(swedishStationNames).to.include('Dynamiittivaihde')
      })
    })

    describe('locale stations (sv, fi, en)', () => {
      const pasilaCarCarrierStation = localizedStations.find(
        station => station.stationShortCode === 'PAU'
      )

      it('has keys for swedish, english and finnish', () => {
        for (const localeStation of localizedStations) {
          expect(Object.keys(localeStation.stationName)).toStrictEqual([
            'fi',
            'en',
            'sv'
          ])
        }
      })

      it('has translation in finnish', () => {
        expect(pasilaCarCarrierStation.stationName.fi).toStrictEqual(
          'Pasila autojuna-asema'
        )
      })

      it('has translation in swedish', () => {
        expect(pasilaCarCarrierStation.stationName.sv).toStrictEqual(
          'Böle biltågsstation'
        )
      })

      it('has translation in english', () => {
        expect(pasilaCarCarrierStation.stationName.en).toStrictEqual(
          'Pasila car-carrier station'
        )
      })
    })
  })
})
