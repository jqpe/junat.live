import { showFetchButton } from '~/features/pages/station/helpers'

import { it, expect, describe } from 'vitest'
import { DEFAULT_TRAINS_COUNT, TRAINS_MULTIPLIER } from '~/constants'

describe('show fetch button', () => {
  it('is hidden when there are no trains', () => {
    expect(showFetchButton([])).toBe(false)
  })

  it('is hidden if no parameters are supplied', () => {
    expect(showFetchButton()).toBe(false)
  })

  it('is hidden when amount of trains equals to DEFAULT_TRAINS_COUNT and fetch count > 0', () => {
    const fetchCount = 1 as const
    const trains = Array.from({ length: DEFAULT_TRAINS_COUNT })

    expect(showFetchButton(trains, fetchCount)).toBe(false)
  })

  it('is hidden when trains.length % TRAINS_MULTIPLIER != 0', () => {
    // E.g. when trains were fetched for three times (n0 = 20, n1 = 100, n2 = 101)
    const trains = Array.from({ length: TRAINS_MULTIPLIER + 1 })

    expect(showFetchButton(trains)).toBe(false)
  })

  it('is visible when amount of trains equals to DEFAULT_TRAINS_COUNT and fetch count = 0', () => {
    const trains = Array.from({ length: DEFAULT_TRAINS_COUNT })

    expect(showFetchButton(trains)).toBe(true)
  })

  it('is visible when trains.length % TRAINS_MULTIPLIER = 0', () => {
    const trains = Array.from({ length: TRAINS_MULTIPLIER })

    expect(showFetchButton(trains)).toBe(true)
  })
})