import { getPrettifiedAccuracy } from '../utils/accuracy'

import { it, expect } from 'vitest'

it('returns accuracy in meters when accuracy is less than 1000', () => {
  expect(getPrettifiedAccuracy(35, 'en')).toStrictEqual('35 metres')
})

it('returns truncated accuracy when accuracy is less than 1000 and accuracy has decimal points', () => {
  expect(getPrettifiedAccuracy(121.212, 'en')).toStrictEqual('121 metres')
})

it('returns accuracy in kilometers when accuracy is greater than or equal to 1000 meters', () => {
  expect(getPrettifiedAccuracy(1000, 'en')).toStrictEqual('1 kilometre')
  expect(getPrettifiedAccuracy(2002, 'en')).toStrictEqual('2 kilometres')
})

it('returns accuracy in metre (singular) if truncated accuracy is equal to 1', () => {
  expect(getPrettifiedAccuracy(1.5, 'en')).toStrictEqual('1 metre')
})

it('returns en meter when accuracy is equal to one and locale is swedish', () => {
  expect(getPrettifiedAccuracy(1, 'sv')).toStrictEqual('en meter')
})

it('returns en kilometer when accuracy is equal to one and locale is swedish', () => {
  expect(getPrettifiedAccuracy(1000, 'sv')).toStrictEqual('en kilometer')
})