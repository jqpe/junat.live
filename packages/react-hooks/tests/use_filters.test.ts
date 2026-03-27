import { act, renderHook } from '@testing-library/react'
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing'
import { describe, expect, test } from 'vitest'

import { useStationFilters } from '../src/use_filters'

describe('use filters', () => {
  const { result: filters } = renderHook(() => useStationFilters(), {
    wrapper: withNuqsTestingAdapter(),
  })

  test('stopStation is a zero width string by default', () => {
    expect(filters.current.stopStation).toBe(null)
  })

  test('stopStation can be set to a string', async () => {
    await act(() => filters.current.setStopStation('HKI'))

    expect(filters.current.stopStation).toStrictEqual('HKI')
  })
})
