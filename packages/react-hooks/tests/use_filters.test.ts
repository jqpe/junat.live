import { act, renderHook } from '@testing-library/react'
import { beforeAll, describe, expect, test, vi } from 'vitest'

import { useStationFilters } from '../src/use_filters'

describe('use filters', () => {
  beforeAll(() => {
    // Resets the state on each test, see __mocks__/zustand.js
    vi.mock('zustand')
  })

  const { result: filters } = renderHook(() => useStationFilters('RI'))

  test('destination is null by default', () => {
    expect(filters.current.destination).toBe(null)
  })

  test('destination can be set to a string', () => {
    act(() => filters.current.setDestination('HKI'))

    expect(filters.current.destination).toStrictEqual('HKI')
  })

  test('treats zero byte strings as null', () => {
    act(() => filters.current.setDestination(''))

    expect(filters.current.destination).toBe(null)
  })
})
