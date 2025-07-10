import type { RenderHookOptions } from '@testing-library/react'
import type { Train } from '@junat/digitraffic/types'

import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { convertTrain } from '@junat/core/utils/train'
import { TimeTableRowType } from '@junat/graphql/digitraffic'

import {
  updateMatchingTrains,
  useLiveTrainsSubscription,
} from '../../src/digitraffic/use_live_trains_subscription'
import stations from './stations.json'
import _train from './train.json'

const train = convertTrain(_train as Train)

const WRAPPER: RenderHookOptions<unknown>['wrapper'] = props => (
  <QueryClientProvider client={new QueryClient()}>
    {props.children}
  </QueryClientProvider>
)

const TYPE = TimeTableRowType.Departure
const STATION_SHORT_CODE = 'HKI'

const trainTestId = crypto.randomUUID()

const unsubscribe = vi.hoisted(() => vi.fn())
const setQueriesData = vi.hoisted(() => vi.fn())

const subscribeToStation = vi.hoisted(() => {
  const createIterator = async function* () {
    yield { trainNumber: trainTestId }
  }

  return vi.fn().mockResolvedValue({
    unsubscribe,
    // Use getter to force `createIterator` to be called on each access.
    get trains() {
      return createIterator()
    },
  })
})

const mockQueryClient = vi.hoisted(() => {
  return {
    setQueriesData,
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
    renderHook(() => useLiveTrainsSubscription(STATION_SHORT_CODE, TYPE), {
      wrapper: WRAPPER,
    })

    await waitFor(() => expect(subscribeToStation).toHaveBeenCalledOnce())
    await waitFor(() =>
      expect(subscribeToStation).toHaveBeenCalledWith(STATION_SHORT_CODE),
    )
  })

  it('clears the subscription when the component unmounts', async () => {
    const { unmount } = renderHook(
      () => useLiveTrainsSubscription(STATION_SHORT_CODE, TYPE),
      {
        wrapper: WRAPPER,
      },
    )

    await waitFor(() => expect(subscribeToStation).toHaveBeenCalledOnce())

    unmount()

    await waitFor(() => expect(unsubscribe).toHaveBeenCalledOnce())
  })

  it('updates existing trains on train cache', async () => {
    renderHook(() => useLiveTrainsSubscription(STATION_SHORT_CODE, TYPE), {
      wrapper: WRAPPER,
    })

    await waitFor(() => expect(subscribeToStation).toHaveBeenCalledOnce())
    await waitFor(() => expect(setQueriesData).toHaveBeenCalledOnce())
  })

  it('creates client exactly once', async () => {
    const { rerender } = renderHook(
      () => useLiveTrainsSubscription(STATION_SHORT_CODE, TYPE),
      {
        wrapper: WRAPPER,
      },
    )

    await waitFor(() => expect(subscribeToStation).toHaveBeenCalledOnce())

    rerender()
    rerender()
    rerender()

    await waitFor(() => expect(subscribeToStation).toHaveBeenCalledOnce())
  })
})

describe('update matching trains', async () => {
  const params = {
    trains: [train],
    updatedTrain: train,
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
      tr => tr.station.shortCode === params.stationShortCode,
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
