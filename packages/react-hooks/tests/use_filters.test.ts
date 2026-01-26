import { act, renderHook } from '@testing-library/react'
import { beforeAll, describe, expect, test, vi } from 'vitest'

import { useStationFilters } from '../src/use_filters'

describe('use filters', () => {
  beforeAll(() => {
    // Resets the state on each test, see __mocks__/zustand.js
    vi.mock('zustand')
  })

  const { result: filters } = renderHook(() => useStationFilters())

  test('stopStation is a zero width string by default', () => {
    expect(filters.current.stopStation).toBe('')
  })

  test('stopStation can be set to a string', () => {
    act(() => filters.current.setStopStation('HKI'))

    expect(filters.current.stopStation).toStrictEqual('HKI')
  })
})
