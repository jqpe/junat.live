import { describe, expect, it } from 'vitest'

import { translate } from '~/i18n'
import { getTrainType } from '~/utils/train'

import 'core-js/actual/array/at'

import { LOCALES } from '@junat/core/constants'

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
      const t = translate(locale)

      expect(() =>
        getTrainType(code, {
          train: t('train'),
          trainTypes: t('trainTypes'),
        }),
      ).not.toThrow()
    }
  })

  // We want to check this behavior as codes are often feeded from an API and new codes that are not included in our code should not break the functionality
  it('may return generic translation of train if code does not exist', () => {
    const t = translate('en')
    const i18n = { train: t('train'), trainTypes: t('trainTypes') } as const

    // @ts-expect-error ANY is not a predefined code
    expect(() => getTrainType('ANY', i18n)).not.toThrow()
    // @ts-expect-error ANY is not a predefined code
    expect(getTrainType('ANY', i18n)).toStrictEqual(t('train'))
  })
})
