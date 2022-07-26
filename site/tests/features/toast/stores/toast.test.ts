import { useToast } from '@features/toast'
import { act, renderHook } from '@testing-library/react'

import { it, vi, expect, beforeAll } from 'vitest'

beforeAll(() => {
  // Resets the state after each test, see __mocks__/zustand.js
  vi.mock('zustand')
})

it('sets current toast', () => {
  const { result } = renderHook(() => useToast())

  act(() => result.current.toast({ title: 'toast' }))

  expect(result.current.current?.title).toStrictEqual('toast')
})

// Store state is undefined inside Promise (lines 52-64) with vitest, works on a browser.
it.skip('resets after duration', () => {
  const { result } = renderHook(() => useToast())

  vi.useFakeTimers()

  act(() => result.current.toast({ title: 'toast', duration: 3000 }))

  expect(result.current.current).toBeDefined()

  vi.advanceTimersByTime(3000)

  expect(result.current.current).not.toBeDefined()

  vi.useRealTimers()
})

it('can close previous toasts', () => {
  const { result } = renderHook(() => useToast())

  act(() => result.current.toast('toast'))

  expect(result.current.current).toBeDefined()

  act(() => result.current.close())

  expect(result.current.current).toBeUndefined()
})
