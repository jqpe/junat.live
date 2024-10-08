import { act, renderHook } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { useStationPage } from '../src/use_station_page'

describe('use station page', () => {
  beforeAll(() => {
    // Resets the state on each test, see __mocks__/zustand.js
    vi.mock('zustand')
  })

  const { result: stationPage } = renderHook(() => useStationPage())

  it('starts with empty object by default', () => {
    // @ts-expect-error stations is an internal value
    expect(stationPage.current.stations).toStrictEqual({})
  })

  it('returns zero for undefined key', () => {
    expect(stationPage.current.getCount('invalid')).toStrictEqual(0)
  })

  it('can set the count for a key', () => {
    act(() => {
      stationPage.current.setCount(1, '/helsinki')
    })

    expect(stationPage.current.getCount('/helsinki')).toStrictEqual(1)
  })

  it('can set the count for multiple keys', () => {
    act(() => {
      stationPage.current.setCount(2, '/helsinki')
      stationPage.current.setCount(1, '/ainola')
    })

    expect(stationPage.current.getCount('/helsinki')).toStrictEqual(2)
    expect(stationPage.current.getCount('/ainola')).toStrictEqual(1)
  })
})
