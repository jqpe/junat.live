import type { LocalizedStation, Station } from '../../types/station'

import { expect, it } from 'vitest'

import { tweakStationNames } from '../../src/utils/tweak_station_names'

it('removes suffix', () => {
  const tweaked = tweakStationNames([
    { stationName: 'Helsinki asema' }
  ] as Station[])[0]

  expect(tweaked.stationName).toStrictEqual('Helsinki')
})

it('works for localized stations', () => {
  const station = {
    stationName: {
      fi: 'Helsinki asema',
      en: 'Helsinki airport',
      sv: 'Kerava asema'
    }
  }

  const tweaked = tweakStationNames([station] as LocalizedStation[], [
    'fi',
    'en',
    'sv'
  ])[0]

  const expected = {
    fi: 'Helsinki',
    en: 'Helsinki airport',
    sv: 'Kerava'
  }

  for (const locale of ['fi', 'en', 'sv']) {
    expect(tweaked.stationName[locale]).toStrictEqual(expected[locale])
  }
})

it('skips undefined', () => {
  const tweaked = tweakStationNames(
    [
      {
        stationName: {
          fi: 'Helsinki asema',
          sv: 'Kerava asema'
        }
      }
    ] as LocalizedStation[],
    ['fi', undefined, 'sv']
  )

  expect(tweaked).toStrictEqual([
    { stationName: { fi: 'Helsinki', sv: 'Kerava' } }
  ])
})
