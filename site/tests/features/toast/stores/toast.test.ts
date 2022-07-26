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

it('resets after duration', async () => {
  vi.useFakeTimers()

  const { result } = renderHook(() => useToast())

  act(() => result.current.toast({ title: 'toast', duration: 3000 }))

  expect(result.current.current).toBeDefined()

  await act(async () =>
    Promise.race([
      result.current.toast({ title: 'toast', duration: 3000 }),
      (() => {
        vi.advanceTimersByTime(3000)
        return Promise.resolve()
      })()
    ])
  )

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
