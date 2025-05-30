import { describe, expect, it } from 'vitest'

import { i18n } from '../../mocks/stations'
import { fetchStations, INACTIVE_STATIONS } from '../../src/handlers/stations'

it("doesn't contain inactive stations by default", async () => {
  const stations = await fetchStations()
  const stationShortCodes = stations.map(station => station.stationShortCode)

  expect(stationShortCodes).not.to.include.members(INACTIVE_STATIONS)
})

it('includes inactive stations if keep inactiove stations is true', async () => {
  const nonOmitted = await fetchStations({
    keepInactive: true,
    keepNonPassenger: true,
  })
  const nonOmittedCodes = nonOmitted.map(station => station.stationShortCode)

  expect(nonOmittedCodes).to.include.members(INACTIVE_STATIONS)
})

it("doesn't include non passenger stations if include passenger stations is false", async () => {
  const nonPassenger = await fetchStations({
    keepNonPassenger: false,
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
    station => station.stationShortCode === 'JP',
  )!

  expect(jarvenpaa.stationName).toStrictEqual('Järvenpää asema')
})

it("doesn't include inactive stations", async () => {
  const stations = await fetchStations({ inactiveStations: ['JP'] })
  expect(stations.find(station => station.stationShortCode === 'JP')).toBe(
    undefined,
  )
})

describe('i18n', () => {
  describe('english (en)', async () => {
    it('includes english station names', async () => {
      const enStations = await fetchStations({
        i18n,
      })

      const englishStationNames = enStations.map(
        station => station.stationName.en,
      )

      expect(englishStationNames).to.include('Pasila car-carrier station')
    })
  })

  describe("finnish (fi) acts as a override, but doens't allow undefined or null", () => {
    it('works with an empty object', async () => {
      const fiStations = await fetchStations({ i18n: { fi: {} } })

      expect(fiStations.map(s => s.stationName.fi)).not.to.include(undefined)
    })

    it('overrides', async () => {
      const fiStations = await fetchStations({ i18n: { fi: { JP: 'test' } } })

      const jarvenpaa = fiStations.find(s => s.stationShortCode === 'JP')

      expect(jarvenpaa?.stationName.fi).toStrictEqual('test')
    })

    it('skips empty strings', async () => {
      const fiStations = await fetchStations({
        i18n: { fi: { JP: '', PAU: 'test' } },
      })

      const jarvenpaa = fiStations.find(s => s.stationShortCode === 'JP')
      const pau = fiStations.find(s => s.stationShortCode === 'PAU')

      expect(jarvenpaa?.stationName.fi).not.toBe('')

      expect(pau?.stationName.fi).toBe('test')
    })
  })

  describe('proxy', () => {
    it('returs finnish value as a fallback', async () => {
      const stations = await fetchStations({
        i18n: { psadpja1919: {} },
        proxy: true,
      })

      const jarvenpaa = stations.find(s => s.stationShortCode === 'JP')
      expect(jarvenpaa?.stationName.psadpja1919).toStrictEqual(
        'Järvenpää asema',
      )
    })

    it('uses localized value if present and proxy for others', async () => {
      const stations = await fetchStations({
        i18n: { a: { JP: 'test' } },
        proxy: true,
      })

      const jarvenpaa = stations.find(s => s.stationShortCode === 'JP')
      expect(jarvenpaa?.stationName.a).toStrictEqual('test')
    })
  })

  describe('localized stations fi, en', async () => {
    it('has keys for swedish, english and finnish', async () => {
      const localizedStations = await fetchStations({
        i18n,
      })
      for (const localizedStation of localizedStations) {
        expect(Object.keys(localizedStation.stationName)).toStrictEqual([
          'fi',
          'en',
        ])
      }
    })

    it('works with better names set to false', async () => {
      const localizedWordyStations = await fetchStations({
        betterNames: false,
        i18n,
      })

      const jarvenpaa = localizedWordyStations.find(
        ({ stationShortCode }) => stationShortCode === 'JP',
      )!

      expect(jarvenpaa.stationName.fi).toStrictEqual('Järvenpää asema')
    })

    it('has translation in finnish', async () => {
      const localizedStations = await fetchStations({
        i18n,
      })

      const pasilaCarCarrierStation = localizedStations.find(
        station => station.stationShortCode === 'PAU',
      )!

      expect(pasilaCarCarrierStation.stationName.fi).toStrictEqual(
        'Pasila autojuna-asema',
      )
    })

    it('has translation in english', async () => {
      const localizedStations = await fetchStations({
        i18n,
      })

      const pasilaCarCarrierStation = localizedStations.find(
        station => station.stationShortCode === 'PAU',
      )!

      expect(pasilaCarCarrierStation.stationName.en).toStrictEqual(
        'Pasila car-carrier station',
      )
    })
  })
})
