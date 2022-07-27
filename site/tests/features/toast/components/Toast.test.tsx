import { Toast, ToastProvider, useToast } from '@features/toast'

import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor
} from '@testing-library/react'
import { it, expect, afterEach } from 'vitest'

afterEach(cleanup)

it('renders new toast', () => {
  render(<Toast />, { wrapper: ToastProvider })

  const { result: hook } = renderHook(() => useToast())
  act(() => hook.current.toast('toast'))

  expect(screen.getByText('toast')).toBeDefined()
})

it('can be closed with hook', async () => {
  render(<Toast />, {
    wrapper: ToastProvider
  })

  const { result: hook } = renderHook(() => useToast())

  await act(async () =>
    Promise.race([
      hook.current.toast({ title: 'toast', duration: 3000 }),
      (() => {
        hook.current.close()

        return Promise.resolve()
      })()
    ])
  )

  await waitFor(
    () => {
      expect(screen.queryByText('toast')).toBeNull()
    },
    {
      timeout: 1000
    }
  )
})

it('can be closed by clicking a button', async () => {
  render(<Toast />, { wrapper: ToastProvider })

  const { result: hook } = renderHook(() => useToast())

  act(() => hook.current.toast({ title: 'toast', duration: 3000 }))

  fireEvent.click(screen.getByRole('button'))

  await waitFor(() => expect(screen.queryByText('toast')).toBeNull())
})
