import type { Mock } from 'vitest'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getCalendarDate } from '@junat/core/utils/date'

import * as helpers from '../helpers'

describe(helpers.handleAutoFocus.name, () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('focuses event target and prevents default on event', () => {
    const event = new CustomEvent('focus')
    event.preventDefault = vi.fn()

    const div = document.createElement('div')
    div.focus = vi.fn()

    Object.defineProperty(event, 'target', { value: div })

    helpers.handleAutoFocus(event)

    expect(event.preventDefault).toHaveBeenCalledOnce()
    expect(div.focus).toHaveBeenCalledOnce()
  })

  it('does not crash when event.target is undefined', () => {
    const event = new CustomEvent('focus')
    Object.defineProperty(event, 'target', { value: undefined })

    expect(() => helpers.handleAutoFocus(event)).not.toThrowError()
  })

  it('does not crash if target.focus is not a function', () => {
    const event = new CustomEvent('focus')
    const div = document.createElement('div')
    Object.defineProperty(div, 'focus', { value: undefined })
    Object.defineProperty(event, 'target', { value: div })

    expect(() => helpers.handleAutoFocus(event)).not.toThrowError()
  })
})

describe(helpers.getNewTrainPath.name, () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns a valid path ', () => {
    const newDepartureDate = '2022-01-01'
    const trainNumber = 1

    const path = helpers.getNewTrainPath({
      newDepartureDate,
      trainNumber,
      oldDepartureDate: '2022-01-02',
      path: '/',
    })

    expect(path).toBe(`/${newDepartureDate}/${trainNumber}`)
  })

  it('may return undefined if departure dates are equal', () => {
    const date = '2022-01-01'
    const trainNumber = 1

    const path = helpers.getNewTrainPath({
      newDepartureDate: date,
      oldDepartureDate: date,

      trainNumber,
      path: '/',
    })

    expect(path).toBe(undefined)
  })

  it('returns path without departure date if the date is today', () => {
    const trainNumber = 1

    const path = helpers.getNewTrainPath({
      newDepartureDate: getCalendarDate(new Date().toISOString()),
      oldDepartureDate: '2022-01-01',
      trainNumber,
      path: '/',
    })

    expect(path).toBe(`/${trainNumber}`)
  })

  it('treats latest as today', () => {
    const trainNumber = 1
    const currentCalendarDate = getCalendarDate(new Date().toISOString())

    const path = helpers.getNewTrainPath({
      newDepartureDate: currentCalendarDate,
      oldDepartureDate: 'latest', // Should be converted to a calendar date for today
      trainNumber,
      path: '/',
    })

    // The departure date has not changed if the conversion from 'latest' to current date took place.
    expect(path).toBe(undefined)
  })
})

describe(helpers.handleShare.name, () => {
  // The function does not need to check the existence of `navigator.share`.
  beforeEach(() => {
    vi.stubGlobal(
      'navigator',
      Object.assign(navigator, {
        share: vi.fn().mockImplementation(async () => {}),
      }),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetAllMocks()
  })

  it('calls event.preventDefault()', () => {
    const event = { preventDefault: vi.fn() }
    helpers.handleShare(event as any, {})

    expect(event.preventDefault).toHaveBeenCalledOnce()
  })

  it('resolves with undefined', async () => {
    const event = { preventDefault: vi.fn() }
    const promise = helpers.handleShare(event as any, {})

    await expect(promise).resolves.toBe(undefined)
  })

  it.each(['AbortError', 'InvalidStateError'] as const)(
    'does not reject if error is %s',
    async name => {
      ;(navigator.share as Mock).mockImplementationOnce(async () => {
        throw new DOMException(name, name)
      })

      const event = { preventDefault: vi.fn() }
      const promise = helpers.handleShare(event as any, {})

      await expect(promise).resolves.toBe(undefined)
    },
  )

  it('rejects on any other error', async () => {
    ;(navigator.share as Mock).mockImplementationOnce(
      () => new Promise((_, reject) => reject('any reason')),
    )

    const event = { preventDefault: vi.fn() }
    const promise = helpers.handleShare(event as any, {})

    await expect(promise).rejects.toThrowError('any reason')
  })

  it('calls navigator.share with given data', async () => {
    const data: ShareData = {
      title: 'test',
    }

    const event = { preventDefault: vi.fn() }
    helpers.handleShare(event as any, data)

    expect(navigator.share).toHaveBeenCalledWith(data)
  })
})
