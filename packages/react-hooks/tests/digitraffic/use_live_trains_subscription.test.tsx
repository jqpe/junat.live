import type { RenderHookOptions } from '@testing-library/react'
import type { Train } from '@junat/digitraffic/types'

import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  updateMatchingTrains,
  useLiveTrainsSubscription,
} from '../../src/digitraffic/use_live_trains_subscription'
import stations from './stations.json'
import train from './train.json'

const WRAPPER: RenderHookOptions<unknown>['wrapper'] = props => (
  <QueryClientProvider client={new QueryClient()}>
    {props.children}
  </QueryClientProvider>
)

const props = {
  queryKey: ['trains', 'HKI', 'DEPARTURE'],
  stations: [],
  stationShortCode: 'HKI',
  type: 'DEPARTURE' as const,
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
    },
  })
})

const mockQueryClient = vi.hoisted(() => {
  return {
    setQueryData,
  }
})

afterEach(cleanup)

vi.mock('@junat/digitraffic-mqtt', () => ({
  subscribeToStation,
}))

vi.mock('@tanstack/react-query', async importActual => {
  const actual: {} = await importActual()

  return {
    ...actual,
    useQueryClient: () => mockQueryClient,
  }
})

describe('use live trains subscription', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('subscribes to the client', async () => {
    renderHook(() => useLiveTrainsSubscription(props), {
      wrapper: WRAPPER,
    })

    await waitFor(() => expect(subscribeToStation).toHaveBeenCalledOnce())
    await waitFor(() =>
      expect(subscribeToStation).toHaveBeenCalledWith(props.stationShortCode),
    )
  })

  it('clears the subscription when the component unmounts', async () => {
    const { unmount } = renderHook(() => useLiveTrainsSubscription(props), {
      wrapper: WRAPPER,
    })

    await waitFor(() => expect(subscribeToStation).toHaveBeenCalledOnce())

    unmount()

    await waitFor(() => expect(close).toHaveBeenCalledOnce())
  })

  it('updates existing trains on train cache', async () => {
    renderHook(() => useLiveTrainsSubscription(props), {
      wrapper: WRAPPER,
    })

    await waitFor(() => expect(subscribeToStation).toHaveBeenCalledOnce())
    await waitFor(() => expect(setQueryData).toHaveBeenCalledOnce())
  })

  it('creates client exactly once', async () => {
    const { rerender } = renderHook(() => useLiveTrainsSubscription(props), {
      wrapper: WRAPPER,
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
        wrapper: WRAPPER,
      },
    )

    await waitFor(() => expect(subscribeToStation).toHaveBeenCalledWith('HKI'))

    rerender({ stationShortCode: 'AIN' })

    await waitFor(() => expect(close).toHaveBeenCalledOnce())
    await waitFor(() => expect(subscribeToStation).toHaveBeenCalledWith('AIN'))
  })
})

describe('update matching trains', async () => {
  const params = {
    trains: [train as Train],
    updatedTrain: train as Train,
    stationShortCode: 'HKI',
    stations,
    type: 'DEPARTURE' as const,
  }

  it('returns an empty array if trains is undefined', async () => {
    expect(
      updateMatchingTrains(
        undefined,
        params.updatedTrain,
        params.stationShortCode,
        params.type,
      ),
    ).toEqual([])
  })

  it('returns original trains if there is no matching train', () => {
    expect(
      updateMatchingTrains(
        params.trains,
        { ...params.updatedTrain, trainNumber: -1 },
        params.stationShortCode,
        params.type,
      ),
    ).toEqual(params.trains)
  })

  it('returns trains in future after updating fields', () => {
    const timetableRowToFind = params.updatedTrain.timeTableRows.find(
      tr => tr.stationShortCode === params.stationShortCode,
    )

    if (!timetableRowToFind) {
      throw new TypeError(
        'Mock data has been modified in such a way that the test is no longer valid.',
      )
    }

    vi.useFakeTimers()
    const beforeScheduledTime =
      Date.parse(timetableRowToFind.scheduledTime) - 1000
    vi.setSystemTime(beforeScheduledTime)

    expect(
      updateMatchingTrains(
        params.trains,
        params.updatedTrain,
        params.stationShortCode,
        params.type,
      ),
    ).toEqual(params.trains)
  })

  vi.useRealTimers()
})
