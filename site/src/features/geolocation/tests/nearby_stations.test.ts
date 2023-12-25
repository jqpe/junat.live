import { getPrettifiedAccuracy } from '../utils/accuracy'

import { it, expect } from 'vitest'

it('returns accuracy in meters when accuracy is less than 1000', () => {
  expect(getPrettifiedAccuracy(35)).toStrictEqual('35 meters')
})

it('returns truncated accuracy when accuracy is less than 1000 and accuracy has decimal points', () => {
  expect(getPrettifiedAccuracy(121.212)).toStrictEqual('121 meters')
})

it('returns accuracy in kilometers when accuracy is greater than or equal to 1000 meters', () => {
  expect(getPrettifiedAccuracy(1000)).toStrictEqual('1 kilometer')
  expect(getPrettifiedAccuracy(2002)).toStrictEqual('2 kilometers')
})

it('returns accuracy in metre (singular) if truncated accuracy is equal to 1', () => {
  expect(getPrettifiedAccuracy(1.5)).toStrictEqual('1 metre')
})
