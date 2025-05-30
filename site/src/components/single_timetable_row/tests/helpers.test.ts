import type { Locale } from '~/types/common'

import { describe, expect, it } from 'vitest'

import {
  getLocalizedStationName,
  hasDeparted,
  hasLiveEstimate,
} from '../helpers'

describe('localized station name getter', () => {
  it('returns a localized station', () => {
    const locale = 'en'

    const station = {
      stationName: { en: 'x', fi: 'y' } as Record<Locale, string>,
      stationShortCode: 'code',
    }

    const stationName = getLocalizedStationName(locale, [station], {
      stationShortCode: station.stationShortCode,
    })

    expect(stationName).toStrictEqual(station.stationName[locale])
  })
})

describe('has departed', () => {
  it('prioritizes live estimate time', () => {
    const departed = hasDeparted({
      scheduledTime: (() => {
        const past = new Date()
        past.setMinutes(past.getMinutes() - 5)

        return past.toISOString()
      })(),
      liveEstimateTime: (() => {
        const future = new Date()
        future.setFullYear(future.getFullYear() + 1)

        return future.toISOString()
      })(),
    })

    expect(departed).toStrictEqual(false)
  })

  it('considers train departed if train is in the past', () => {
    const date = new Date()
    date.setMinutes(date.getMinutes() - 5)

    const past = date.toISOString()

    expect(hasDeparted({ scheduledTime: past })).toBe(true)
  })

  it('considers train departed if departed equals to current time', () => {
    expect(hasDeparted({ scheduledTime: new Date().toISOString() })).toBe(true)
  })
})

describe('has live estimate', () => {
  it("returns false if timetable doesn't have live estimate", () => {
    // @ts-expect-error The function should return early so scheduled time is not read.
    expect(hasLiveEstimate({})).toBe(false)
  })

  it('returns false if live estimate time minutes and hours are equal', () => {
    expect(
      hasLiveEstimate({
        scheduledTime: new Date().toISOString(),
        liveEstimateTime: new Date().toISOString(),
      }),
    ).toBe(false)
  })

  it('returns true if live estimate is greater than a minute', () => {
    const msSinceEpoch = Date.now()
    const minute = 60 * 1000

    expect(
      hasLiveEstimate({
        scheduledTime: new Date().toISOString(),
        liveEstimateTime: new Date(msSinceEpoch + minute).toISOString(),
      }),
    ).toBe(true)
  })
})
