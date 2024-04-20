import { useLiveTrainsSubscription } from '../../hooks'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '~/lib/react_query'

import {
  cleanup,
  renderHook,
  RenderHookOptions,
  waitFor
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const WRAPPER: RenderHookOptions<unknown>['wrapper'] = props => (
  <QueryClientProvider client={queryClient}>
    {props.children}
  </QueryClientProvider>
)

const props = {
  queryKey: ['trains', 'HKI', 'DEPARTURE'],
  stations: [],
  stationShortCode: 'HKI',
  type: 'DEPARTURE' as const
}

const trainTestId = crypto.randomUUID()

const close = vi.hoisted(() => vi.fn())
const setQueryData = vi.hoisted(() => vi.fn())

const subscribeToStation = vi.hoisted(() => {
  const createIterator = async function* () {
    yield { trainNumber: trainTestId }
  }

  return vi.fn().mockResolvedValue({
    close,
    // Use getter to force `createIterator` to be called on each access.
    get trains() {
      return createIterator()
    }
  })
})

const mockQueryClient = vi.hoisted(() => {
  return {
    setQueryData
  }
})

afterEach(cleanup)

vi.mock('@junat/digitraffic-mqtt', () => ({
  subscribeToStation
}))

vi.mock('@tanstack/react-query', async importActual => {
  const actual: {} = await importActual()

  return {
    ...actual,
    useQueryClient: () => mockQueryClient
  }
})

describe('use live trains subscription', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('subscribes to the client', async () => {
    renderHook(() => useLiveTrainsSubscription(props), {
      wrapper: WRAPPER
    })

    await waitFor(() => expect(subscribeToStation).toHaveBeenCalledOnce())
    await waitFor(() =>
      expect(subscribeToStation).toHaveBeenCalledWith(props.stationShortCode)
    )
  })

  it('clears the subscription when the component unmounts', async () => {
    const { unmount } = renderHook(() => useLiveTrainsSubscription(props), {
      wrapper: WRAPPER
    })

    await waitFor(() => expect(subscribeToStation).toHaveBeenCalledOnce())

    unmount()

    await waitFor(() => expect(close).toHaveBeenCalledOnce())
  })

  it('updates existing trains on train cache', async () => {
    renderHook(() => useLiveTrainsSubscription(props), {
      wrapper: WRAPPER
    })

    await waitFor(() => expect(subscribeToStation).toHaveBeenCalledOnce())
    await waitFor(() => expect(setQueryData).toHaveBeenCalledOnce())
  })

  it('creates client exactly once', async () => {
    const { rerender } = renderHook(() => useLiveTrainsSubscription(props), {
      wrapper: WRAPPER
    })

    await waitFor(() => expect(subscribeToStation).toHaveBeenCalledOnce())

    rerender()
    rerender()
    rerender()

    await waitFor(() => expect(subscribeToStation).toHaveBeenCalledOnce())
  })

  it('destroys old client and creates a new one if station short code changes', async () => {
    const { rerender } = renderHook(
      (rerenderProps: any = {}) => {
        return useLiveTrainsSubscription(Object.assign(props, rerenderProps))
      },
      {
        wrapper: WRAPPER
      }
    )

    await waitFor(() => expect(subscribeToStation).toHaveBeenCalledWith('HKI'))

    rerender({ stationShortCode: 'AIN' })

    await waitFor(() => expect(close).toHaveBeenCalledOnce())
    await waitFor(() => expect(subscribeToStation).toHaveBeenCalledWith('AIN'))
  })
})
