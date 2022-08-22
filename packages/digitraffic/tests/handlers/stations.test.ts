import { describe, it, expect } from 'vitest'

import stations from '../../src/data/i18n.json'

import { fetchStations, INACTIVE_STATIONS } from '../../src/handlers/stations'

it("doesn't contain inactive stations by default", async () => {
  const stations = await fetchStations()
  const stationShortCodes = stations.map(station => station.stationShortCode)

  expect(stationShortCodes).not.to.include.members(INACTIVE_STATIONS)
})

it('includes inactive stations if keep inactiove stations is true', async () => {
  const nonOmitted = await fetchStations({
    keepInactive: true,
    keepNonPassenger: true
  })
  const nonOmittedCodes = nonOmitted.map(station => station.stationShortCode)

  expect(nonOmittedCodes).to.include.members(INACTIVE_STATIONS)
})

it("doesn't include non passenger stations if include passenger stations is false", async () => {
  const nonPassenger = await fetchStations({
    keepNonPassenger: false
  })

  expect(nonPassenger.filter(s => !s.passengerTraffic)).toHaveLength(0)
  expect(nonPassenger.length).toBeGreaterThan(0)
})

it('has better names if parameter is set', async () => {
  const stations = await fetchStations({ betterNames: true })
  const jarvenpaa = stations.find(station => station.stationShortCode === 'JP')!

  expect(jarvenpaa.stationName).toStrictEqual('Järvenpää')
})

it('has wordy station names if better names is false', async () => {
  const wordyStations = await fetchStations({ betterNames: false })
  const jarvenpaa = wordyStations.find(
    station => station.stationShortCode === 'JP'
  )!

  expect(jarvenpaa.stationName).toStrictEqual('Järvenpää asema')
})

describe('i18n', () => {
  describe('english (en)', async () => {
    it('includes english station names', async () => {
      const enStations = await fetchStations({
        i18n: stations
      })

      const englishStationNames = enStations.map(
        station => station.stationName.en
      )

      expect(englishStationNames).to.include('Pasila car-carrier station')
    })
  })

  describe('swedish (sv)', async () => {
    it('includes swedish station names', async () => {
      const svStations = await fetchStations({
        i18n: stations
      })

      const swedishStationNames = svStations.map(
        station => station.stationName.sv
      )

      expect(swedishStationNames).to.include('Träskända')
    })
  })

  describe('localized stations (fi, en, sv)', async () => {
    it('has keys for swedish, english and finnish', async () => {
      const localizedStations = await fetchStations({
        i18n: stations
      })
      for (const localizedStation of localizedStations) {
        expect(Object.keys(localizedStation.stationName)).toStrictEqual([
          'fi',
          'en',
          'sv'
        ])
      }
    })

    it('works with better names set to false', async () => {
      const localizedWordyStations = await fetchStations({
        betterNames: false,
        i18n: stations
      })

      const jarvenpaa = localizedWordyStations.find(
        ({ stationShortCode }) => stationShortCode === 'JP'
      )!

      expect(jarvenpaa.stationName.sv).toStrictEqual('Träskända')
    })

    it('has translation in finnish', async () => {
      const localizedStations = await fetchStations({
        i18n: stations
      })

      const pasilaCarCarrierStation = localizedStations.find(
        station => station.stationShortCode === 'PAU'
      )!

      expect(pasilaCarCarrierStation.stationName.fi).toStrictEqual(
        'Pasila autojuna-asema'
      )
    })

    it('has translation in swedish', async () => {
      const localizedStations = await fetchStations({
        i18n: stations
      })

      const pasilaCarCarrierStation = localizedStations.find(
        station => station.stationShortCode === 'PAU'
      )!
      expect(pasilaCarCarrierStation.stationName.sv).toStrictEqual(
        'Böle biltågsstation'
      )
    })

    it('has translation in english', async () => {
      const localizedStations = await fetchStations({
        i18n: stations
      })

      const pasilaCarCarrierStation = localizedStations.find(
        station => station.stationShortCode === 'PAU'
      )!
      
      expect(pasilaCarCarrierStation.stationName.en).toStrictEqual(
        'Pasila car-carrier station'
      )
    })
  })
})
