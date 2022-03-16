import type { Train } from '../types/train'

import { describe, expect, it } from 'vitest'

import singleTrain from './fixtures/single_train.json'

describe('get single train', () => {
  const train: Train = singleTrain[0]
  it('has a single train', () => {
    expect(singleTrain).toHaveLength(1)
  })

  it('train number is one', () => {
    expect(train.trainNumber).toStrictEqual(1)
  })
})
