import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useTimetableType } from '../src/use_timetable_type'

describe('useTimetableType', () => {
  it('should initialize with default type as DEPARTURE', () => {
    const { result } = renderHook(() => useTimetableType())
    expect(result.current.type).toBe('DEPARTURE')
  })

  it('should update type when setType is called', () => {
    const { result } = renderHook(() => useTimetableType())

    act(() => {
      result.current.actions.setType('ARRIVAL')
    })

    expect(result.current.type).toBe('ARRIVAL')
  })

  it('should not change type when setting the same value', () => {
    const { result } = renderHook(() => useTimetableType())

    act(() => {
      result.current.actions.setType('DEPARTURE')
    })

    expect(result.current.type).toBe('DEPARTURE')
  })

  it('should toggle between ARRIVAL and DEPARTURE', () => {
    const { result } = renderHook(() => useTimetableType())

    act(() => {
      result.current.actions.setType('ARRIVAL')
    })
    expect(result.current.type).toBe('ARRIVAL')

    act(() => {
      result.current.actions.setType('DEPARTURE')
    })
    expect(result.current.type).toBe('DEPARTURE')
  })
})
