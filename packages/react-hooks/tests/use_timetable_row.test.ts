import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useTimetableRow } from '../src/use_timetable_row'

describe('useTimetableRow', () => {
  it('should initialize with an empty timetableRowId', () => {
    const { result } = renderHook(() => useTimetableRow())
    expect(result.current.timetableRowId).toBe('')
  })

  it('should update timetableRowId when setTimetableRowId is called', () => {
    const { result } = renderHook(() => useTimetableRow())

    act(() => {
      result.current.setTimetableRowId('123')
    })

    expect(result.current.timetableRowId).toBe('123')
  })

  it('should overwrite the previous timetableRowId when setTimetableRowId is called multiple times', () => {
    const { result } = renderHook(() => useTimetableRow())

    act(() => {
      result.current.setTimetableRowId('123')
    })

    act(() => {
      result.current.setTimetableRowId('456')
    })

    expect(result.current.timetableRowId).toBe('456')
  })

  it('should handle empty string as a valid timetableRowId', () => {
    const { result } = renderHook(() => useTimetableRow())

    act(() => {
      result.current.setTimetableRowId('123')
    })

    act(() => {
      result.current.setTimetableRowId('')
    })

    expect(result.current.timetableRowId).toBe('')
  })
})
