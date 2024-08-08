import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

import { useWakeLock } from '~/hooks/use_wake_lock'

afterEach(() => {
  vi.resetAllMocks()
})

const SENTINEL = {
  release: vi.fn(),
} as const

it('initializes a new wakelock when invoked', async () => {
  stubWakeLock()

  const { result: wakeLock } = renderHook(() => useWakeLock())

  await waitFor(() => {
    expect(wakeLock.current?.enabled).toBe(true)
    expect(wakeLock.current?.sentinel).toBeDefined()
  })
})

it('may return early if document is not visible', async () => {
  // Note: don't mock navigator.wakeLock as it should not be accessed if `document.visibilityState` === "hidden"

  Object.defineProperty(document, 'visibilityState', {
    value: 'hidden',
    writable: true,
  })
  document.dispatchEvent(new Event('visibilitychange', { bubbles: true }))

  expect(window.document.visibilityState).toStrictEqual('hidden')

  const { result: wakeLock } = renderHook(() => useWakeLock())

  await waitFor(() => {
    // The `useWakeLock` hook will return undefined as it doesn't invoke `navigator.wakeLock.request`
    expect(wakeLock.current).toBe(undefined)
  })

  Object.defineProperty(document, 'visibilityState', {
    value: 'visible',
    writable: true,
  })
  document.dispatchEvent(new Event('visibilitychange', { bubbles: true }))
})

it('returns an incomplete object if `navigator.wakeLock` is not defined', async () => {
  vi.stubGlobal('navigator', { ...navigator, wakeLock: undefined })

  const { result: wakeLock } = renderHook(() => useWakeLock())

  await waitFor(() => {
    expect(wakeLock.current?.enabled).toBe(false)
    expect(wakeLock.current?.sentinel).not.toBeDefined()
  })
})

it('releases the wakelock sentinel when the hook is unmounted', async () => {
  stubWakeLock()

  const { result: wakeLock, unmount } = renderHook(() => useWakeLock())

  // wait for the sentinel
  await waitFor(() => {
    expect(wakeLock.current?.sentinel).toBeDefined()
  })

  unmount()

  await waitFor(() => {
    expect(SENTINEL.release).toHaveBeenCalledOnce()
  })
})

/**
 * Adds `wakeLock` object to `navigator`.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WakeLock
 */
function stubWakeLock() {
  vi.stubGlobal('navigator', {
    ...navigator,
    wakeLock: { request: vi.fn(async () => SENTINEL) },
  })
}
