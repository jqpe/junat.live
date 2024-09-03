import type { StationPassengerInfoFragment } from '@junat/graphql/digitraffic'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { DEFAULT_TRAINS_COUNT, TRAINS_MULTIPLIER } from '@junat/core/constants'

import { shouldDisplayPassengerInfoMessage, showFetchButton } from '../helpers'
import mockData from './data.json'

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
    const trains = TRAINS_MULTIPLIER

    expect(showFetchButton(trains)).toBe(true)
  })
})

describe('should display passenger info message', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime('2024-07-28T13:52:12.131Z')
  })

  afterEach(() => void vi.useRealTimers())

  it('returns false for expired', () => {
    const shouldDisplay = shouldDisplayPassengerInfoMessage(
      mockData[0] as StationPassengerInfoFragment,
      'en',
    )

    expect(shouldDisplay).toBe(false)
  })

  it('returns true for not expired', () => {
    const shouldDisplay = shouldDisplayPassengerInfoMessage(
      mockData[1] as StationPassengerInfoFragment,
      'en',
    )

    expect(shouldDisplay).toBe(true)
  })

  it('returns false for expired (type = WHEN)', () => {
    const shouldDisplay = shouldDisplayPassengerInfoMessage(
      mockData[2] as StationPassengerInfoFragment,
      'en',
    )

    expect(shouldDisplay).toBe(false)
  })

  it('returns true for not expired (type = WHEN)', () => {
    const shouldDisplay = shouldDisplayPassengerInfoMessage(
      mockData[3] as StationPassengerInfoFragment,
      'en',
    )

    expect(shouldDisplay).toBe(true)
  })
})
