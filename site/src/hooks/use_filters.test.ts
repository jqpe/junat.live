import { useFilters } from './use_filters'

import { beforeAll, describe, expect, test, vi } from 'vitest'

import { act, renderHook } from '@testing-library/react'

describe('use filters', () => {
  beforeAll(() => {
    // Resets the state on each test, see __mocks__/zustand.js
    vi.mock('zustand')
  })

  const { result: filters } = renderHook(() => useFilters())

  test('destination is null by default', () => {
    expect(filters.current.destination).toBe(null)
  })

  test('destination can be set to a string', () => {
    act(() => filters.current.actions.setDestination('HKI'))

    expect(filters.current.destination).toStrictEqual('HKI')
  })

  test('treats zero byte strings as null', () => {
    act(() => filters.current.actions.setDestination(''))

    expect(filters.current.destination).toBe(null)
  })
})
