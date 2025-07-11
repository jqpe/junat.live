import { describe, expect, it } from 'vitest'

import { DEFAULT_TRAINS_COUNT, TRAINS_MULTIPLIER, TRAINS_OVERSHOOT } from '@junat/core/constants'

import { showFetchButton } from '../helpers'

describe('show fetch button', () => {
  it('is hidden when there are no trains', () => {
    expect(showFetchButton(0)).toBe(false)
  })

  it('is hidden when amount of trains equals to DEFAULT_TRAINS_COUNT and fetch count > 0', () => {
    const fetchCount = 1 as const
    const trains = DEFAULT_TRAINS_COUNT

    expect(showFetchButton(trains, false, fetchCount)).toBe(false)
  })

  it('is hidden when trains.length % TRAINS_MULTIPLIER != 0', () => {
    // E.g. when trains were fetched for three times (n0 = 20, n1 = 100, n2 = 101)
    const trains = TRAINS_MULTIPLIER + 1

    expect(showFetchButton(trains)).toBe(false)
  })

  it('is visible when amount of trains equals to DEFAULT_TRAINS_COUNT and fetch count = 0', () => {
    const trains = DEFAULT_TRAINS_COUNT

    expect(showFetchButton(trains)).toBe(true)
  })

  it('is visible when trains.length % TRAINS_MULTIPLIER = 0', () => {
    const trains = TRAINS_MULTIPLIER + TRAINS_OVERSHOOT

    expect(showFetchButton(trains)).toBe(true)
  })
})
