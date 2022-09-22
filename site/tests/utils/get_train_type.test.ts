import type { Code } from '@utils/get_train_type'

import { getTrainType } from '@utils/get_train_type'

import { expect, it } from 'vitest'

import { LOCALES } from '../../src/constants/locales'

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

type UnionToOvlds<U> = UnionToIntersection<
  U extends any ? (f: U) => void : never
>

type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void ? A : never

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true

type UnionToArray<T, A extends unknown[] = []> = IsUnion<T> extends true
  ? UnionToArray<Exclude<T, PopUnion<T>>, [PopUnion<T>, ...A]>
  : [T, ...A]

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
] as UnionToArray<Code>)('%s works', code => {
  for (const locale of LOCALES) {
    expect(() => getTrainType(code, locale)).not.toThrow()
  }
})
