import { describe, expect, it } from 'vitest'

import { LOCALES } from '@junat/core/constants'

import { translate } from '~/i18n'
import { getTrainType } from '~/utils/train'

import 'core-js/actual/array/at'

describe('get train type', () => {
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
    'V',
  ] as const)('%s works', code => {
    for (const locale of LOCALES) {
      expect(() => getTrainType(code, locale)).not.toThrow()
    }
  })

  // We want to check this behavior as codes are often feeded from an API and new codes that are not included in our code should not break the functionality
  it('may return generic translation of train if code does not exist', () => {
    // @ts-expect-error ANY is not a predefined code
    expect(() => getTrainType('ANY', 'en')).not.toThrow()
    // @ts-expect-error ANY is not a predefined code
    expect(getTrainType('ANY', 'en')).toStrictEqual(translate('en')('train'))
  })
})
