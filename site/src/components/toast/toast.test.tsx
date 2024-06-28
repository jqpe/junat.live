import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'

import { Toast, ToastProvider, useToast } from '.'

afterEach(cleanup)

it('renders new toast', () => {
  render(<Toast />, { wrapper: ToastProvider })

  const { result: hook } = renderHook(() => useToast())
  act(() => hook.current.toast('toast'))

  expect(screen.getByText('toast')).toBeDefined()
})

it('can be closed with hook', async () => {
  render(<Toast />, {
    wrapper: ToastProvider,
  })

  const { result: hook } = renderHook(() => useToast())

  await act(async () => {
    hook.current.toast({ title: 'toast', duration: 3000 })
    hook.current.close()
  })

  await waitFor(() => {
    expect(screen.queryByText('toast')).toBeNull()
  })
})

it('can be closed by clicking a button', async () => {
  render(<Toast />, { wrapper: ToastProvider })

  const { result: hook } = renderHook(() => useToast())

  act(() => hook.current.toast({ title: 'toast', duration: 3000 }))

  fireEvent.click(screen.getByRole('button'))

  await waitFor(() => expect(screen.queryByText('toast')).toBeNull())
})
