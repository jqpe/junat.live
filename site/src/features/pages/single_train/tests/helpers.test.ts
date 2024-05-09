import * as helpers from '../helpers'

import { afterEach, describe, expect, it, vi } from 'vitest'

describe(helpers.getLocalizedDate.name, () => {
  it('returns second argument if date === latest', () => {
    expect(helpers.getLocalizedDate('latest', 'today', 'fi')).toStrictEqual(
      'today'
    )
  })

  it('returns second argument if date is today', () => {
    expect(
      helpers.getLocalizedDate(new Date().toISOString(), 'today', 'fi')
    ).toStrictEqual('today')
  })

  it('returns localized date if date is not today', () => {
    expect(
      helpers.getLocalizedDate(new Date(0).toISOString(), '', 'fi')
    ).toStrictEqual('1.1.1970')
  })

  it('returns today if date is undefined', () => {
    expect(helpers.getLocalizedDate(undefined, 'today', 'fi')).toStrictEqual(
      'today'
    )
  })
})

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
