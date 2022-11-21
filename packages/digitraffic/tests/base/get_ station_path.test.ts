import { getStationPath } from '../../src/base/get_station_path'

import { it, expect, describe } from 'vitest'

describe('removes non uri-safe characters found in finnish alphabet', () => {
  it.each([
    ['ä', 'Järvenpää', 'jarvenpaa'],
    ['ö', 'Kyrö', 'kyro'],
    ['å', 'Torneå östra', 'torneo_ostra']
  ])('%s', (_, actual, expected) => {
    expect(getStationPath(actual)).toStrictEqual(expected)
  })
})

it('replaces spaces with underscore', () => {
  expect(getStationPath('Helsinki asema')).toStrictEqual('helsinki_asema')
})

it('replaces spaces and dashes with underscore', () => {
  expect(getStationPath('Pasila autojuna-asema')).toStrictEqual(
    'pasila_autojuna_asema'
  )
})
