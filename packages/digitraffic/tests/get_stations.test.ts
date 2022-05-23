import type { LocalizedStation } from '../types/station'

import { describe, it, expect } from 'vitest'

import {
  getStations,
  inactiveStationShortCodes
} from '../src/handlers/get_stations'

describe('get stations', () => {
  it("doesn't contain inactive stations by default", async () => {
    const stations = await getStations()
    const stationShortCodes = stations.map(station => station.stationShortCode)

    expect(stationShortCodes).not.to.include.members(inactiveStationShortCodes)
  })

  it('includes inactive stations if omit inactive stations is false', async () => {
    const nonOmitted = await getStations({ omitInactive: false })
    const nonOmittedCodes = nonOmitted.map(station => station.stationShortCode)

    expect(nonOmittedCodes).to.include.members(inactiveStationShortCodes)
  })

  it("doesn't include non passenger stations if include passenger stations is false", async () => {
    const nonPassenger = await getStations({
      includeNonPassenger: false
    })

    expect(nonPassenger.filter(s => !s.passengerTraffic)).toHaveLength(0)
    expect(nonPassenger.length).toBeGreaterThan(0)
  })

  it('has concise names by default', async () => {
    const stations = await getStations()
    const jarvenpaa = stations.find(
      station => station.stationShortCode === 'JP'
    )

    expect(jarvenpaa.stationName).toStrictEqual('Järvenpää')
  })

  it('has wordy station names if better names is false', async () => {
    const wordyStations = await getStations({ betterNames: false })
    const jarvenpaa = wordyStations.find(
      station => station.stationShortCode === 'JP'
    )

    expect(jarvenpaa.stationName).toStrictEqual('Järvenpää asema')
  })

  describe('i18n', () => {
    describe('english (en)', async () => {
      it('includes english station names', async () => {
        const enStations = await getStations<LocalizedStation[]>({
          locale: 'en'
        })

        const englishStationNames = enStations.map(
          station => station.stationName.en
        )

        expect(englishStationNames).to.include('Pasila car-carrier station')
      })

      it('uses finnish translation as a fallback', async () => {
        const enStations = await getStations<LocalizedStation[]>({
          locale: 'en'
        })

        const englishStationNames = enStations.map(
          station => station.stationName.en
        )

        expect(englishStationNames).to.include('Järvenpää')
      })

      it("doesn't contain keys for swedish or finnish", async () => {
        const enStations = await getStations<LocalizedStation[]>({
          locale: 'en'
        })

        const keys = Object.keys(enStations.map(s => s.stationName)[0])
        expect(keys).not.toContain('sv')
        expect(keys).not.toContain('fi')
      })
    })

    describe('swedish (sv)', async () => {
      it('includes swedish station names', async () => {
        const svStations = await getStations<LocalizedStation[]>({
          locale: 'sv'
        })

        const swedishStationNames = svStations.map(
          station => station.stationName.sv
        )

        expect(swedishStationNames).to.include('Träskända')
      })

      it('uses finnish translation as a fallback', async () => {
        const svStations = await getStations<LocalizedStation[]>({
          locale: 'sv'
        })

        const swedishStationNames = svStations.map(
          station => station.stationName.sv
        )

        expect(swedishStationNames).to.include('Dynamiittivaihde')
      })

      it("doesn't contain keys for english or finnish", async () => {
        const enStations = await getStations<LocalizedStation[]>({
          locale: 'sv'
        })

        const keys = Object.keys(enStations.map(s => s.stationName)[0])
        expect(keys).not.toContain('en')
        expect(keys).not.toContain('fi')
      })
    })

    describe('localized stations (sv, fi, en)', async () => {
      it('has keys for swedish, english and finnish', async () => {
        const localizedStations = await getStations<LocalizedStation[]>({
          locale: ['fi', 'en', 'sv']
        })
        for (const localizedStation of localizedStations) {
          expect(Object.keys(localizedStation.stationName)).toStrictEqual([
            'fi',
            'en',
            'sv'
          ])
        }
      })

      it('has translation in finnish', async () => {
        const localizedStations = await getStations<LocalizedStation[]>({
          locale: ['fi', 'en', 'sv']
        })

        const pasilaCarCarrierStation = localizedStations.find(
          station => station.stationShortCode === 'PAU'
        )

        expect(pasilaCarCarrierStation.stationName.fi).toStrictEqual(
          'Pasila autojuna-asema'
        )
      })

      it('has translation in swedish', async () => {
        const localizedStations = await getStations<LocalizedStation[]>({
          locale: ['fi', 'en', 'sv']
        })

        const pasilaCarCarrierStation = localizedStations.find(
          station => station.stationShortCode === 'PAU'
        )
        expect(pasilaCarCarrierStation.stationName.sv).toStrictEqual(
          'Böle biltågsstation'
        )
      })

      it('has translation in english', async () => {
        const localizedStations = await getStations<LocalizedStation[]>({
          locale: ['fi', 'en', 'sv']
        })

        const pasilaCarCarrierStation = localizedStations.find(
          station => station.stationShortCode === 'PAU'
        )

        expect(pasilaCarCarrierStation.stationName.en).toStrictEqual(
          'Pasila car-carrier station'
        )
      })
    })
  })
})
