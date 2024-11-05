import type { RenderHookOptions } from '@testing-library/react'
import type {
  SingleTrainFragment,
  TimeTableRowType,
} from '@junat/graphql/digitraffic'

import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, renderHook, waitFor } from '@testing-library/react'
import { graphql, HttpResponse } from 'msw'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getCalendarDate } from '@junat/core/utils/date'
import { normalizeSingleTrain } from '@junat/graphql/digitraffic/queries/single_train'

import {
  fetchSingleTrain,
  useSingleTrain,
} from '../../src/digitraffic/use_single_train'
import { server } from '../../test_setup'

const wrapper: RenderHookOptions<unknown>['wrapper'] = props => (
  // Create a new query client to not reuse cached data
  <QueryClientProvider client={new QueryClient()}>
    {props.children}
  </QueryClientProvider>
)

const mock = vi.hoisted(() => ({
  useQuery: vi.fn(),
}))

vi.mock('@tanstack/react-query', async imporActual => ({
  ...((await imporActual()) as any),
  useQuery: mock.useQuery,
}))

describe('use single train', () => {
  const latest = getCalendarDate(new Date().toISOString())

  const responseTrain: SingleTrainFragment = {
    departureDate: latest,
    version: '1',
    cancelled: false,
    commuterLineid: 'R',
    timeTableRows: [
      {
        station: { shortCode: 'HKI', passengerTraffic: true },
        scheduledTime: new Date().toISOString(),
        cancelled: false,
        type: 'DEPARTURE' as TimeTableRowType,
        commercialTrack: null,
        commercialStop: null,
        liveEstimateTime: null,
      },
    ],
    trainType: { name: '' },
    trainNumber: 1,
  }

  beforeEach(async () => {
    // Clear useQuery mock state
    const mod = await vi.importActual('@tanstack/react-query')
    mock.useQuery.mockImplementation(mod.useQuery as any)
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('uses current date if date is set to latest', () => {
    // Do not call API
    mock.useQuery.mockImplementationOnce(vi.fn())

    vi.useFakeTimers()
    vi.setSystemTime(0)

    renderHook(
      () => {
        return useSingleTrain({
          trainNumber: 1234,
          departureDate: 'latest',
        })
      },
      { wrapper },
    )

    const mockCalendarDate = getCalendarDate(
      vi.getMockedSystemTime()!.toString(),
    )
    const expected = ['train', mockCalendarDate, 1234]
    expect(mock.useQuery.mock.calls[0][0]['queryKey']).toStrictEqual(expected)
  })

  it('may throw an error if trainNumber or departureDate is undefined', async () => {
    expect(() =>
      fetchSingleTrain(undefined, undefined),
    ).rejects.and.toThrowError()
    expect(() =>
      fetchSingleTrain('2020-01-02', undefined),
    ).rejects.and.toThrowError()
    expect(() => fetchSingleTrain(undefined, 20)).rejects.and.toThrowError()
  })

  it('returns trains for the given trainNumber and departureDate', async () => {
    let requestCtx: any

    server.use(
      graphql.query('singleTrain', async ctx => {
        requestCtx = ctx

        return HttpResponse.json({
          data: { train: [responseTrain] } as any,
        })
      }),
    )

    const params = { departureDate: 'latest', trainNumber: 1 }
    const train = normalizeSingleTrain([responseTrain])

    const { result } = renderHook(() => useSingleTrain(params), {
      wrapper,
    })

    await waitFor(() => expect(result.current.isSuccess).toStrictEqual(true))

    expect(requestCtx.variables.departureDate).toBe(latest)
    expect(requestCtx.variables.trainNumber).toBe(1)

    await waitFor(() => expect(result.current.data).toStrictEqual(train))
    server.resetHandlers()
  })

  const malformedData = [
    { data: { train: undefined }, error: 'train is undefined' },
    { data: { train: [] }, error: 'train is empty' },
  ] as const

  it.each(malformedData)('data may be null if $error', async ({ data }) => {
    server.use(
      graphql.query('singleTrain', () => {
        return HttpResponse.json({
          data: { train: data.train },
        })
      }),
    )

    const { result } = renderHook(
      () => useSingleTrain({ departureDate: 'latest', trainNumber: 1 }),
      { wrapper },
    )

    await waitFor(() => expect(result.current.data).toBeNull())
  })
})
