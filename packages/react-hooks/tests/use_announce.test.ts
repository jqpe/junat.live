import { announce, destroyAnnouncer } from '@react-aria/live-announcer'
import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

import { DEDUPE_TIMEOUT_SECS, useAnnounce } from '../src/use_announce'

vi.mock('@react-aria/live-announcer', () => ({
  announce: vi.fn(),
  destroyAnnouncer: vi.fn(),
}))

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllMocks()
  vi.clearAllTimers()
  vi.useRealTimers()
})

it('calls destroyAnnouncer on unmount', () => {
  const { unmount } = renderHook(() => useAnnounce())
  unmount()
  expect(destroyAnnouncer).toHaveBeenCalled()
})

it('announces message with default settings', () => {
  const { result } = renderHook(() => useAnnounce())
  result.current('test message')
  expect(announce).toHaveBeenCalledWith('test message', undefined, undefined)
})

it('announces message with custom assertiveness and timeout', () => {
  const { result } = renderHook(() =>
    useAnnounce({ assertiveness: 'assertive', timeout: 5000 }),
  )
  result.current('test message')
  expect(announce).toHaveBeenCalledWith('test message', 'assertive', 5000)
})

it('deduplicates identical messages within default timeout', () => {
  const { result } = renderHook(() => useAnnounce())
  result.current('duplicate message')
  result.current('duplicate message')
  expect(announce).toHaveBeenCalledTimes(1)
})

it('allows identical messages after dedupe timeout', () => {
  const { result } = renderHook(() => useAnnounce())
  result.current('test message')
  vi.advanceTimersByTime(DEDUPE_TIMEOUT_SECS + 100)
  result.current('test message')
  expect(announce).toHaveBeenCalledTimes(2)
})

it('respects custom dedupe timeout', () => {
  const customTimeout = 2000
  const { result } = renderHook(() =>
    useAnnounce({ dedupeTimeoutSecs: customTimeout }),
  )
  result.current('test message')
  vi.advanceTimersByTime(customTimeout + 100)
  result.current('test message')
  expect(announce).toHaveBeenCalledTimes(2)
})

it('announces different messages without deduplication', () => {
  const { result } = renderHook(() => useAnnounce())
  result.current('first message')
  result.current('second message')
  expect(announce).toHaveBeenCalledTimes(2)
})
