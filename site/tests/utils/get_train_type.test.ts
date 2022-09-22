import type { Codes } from '@utils/get_train_type'

import { getTrainType } from '@utils/get_train_type'

import { expect, it } from 'vitest'

import { LOCALES } from '../../src/constants/locales'

it.each([
  'AE',
  'HDM',
  'HL',
  'HLV',
  'HSM',
  'HV',
  'IC',
  'LIV',
  'MUS',
  'MUV',
  'MV',
  'P',
  'PAI',
  'PVV',
  'PYO',
  'S',
  'SAA',
  'T',
  'TYO',
  'VET',
  'VEV',
  'VLI',
  'V'
] as Codes)('%s works', code => {
  for (const locale of LOCALES) {
    expect(() => getTrainType(code, locale)).not.toThrow()
  }
})
