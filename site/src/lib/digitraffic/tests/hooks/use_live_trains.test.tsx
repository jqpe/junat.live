import type { RenderHookOptions } from '@testing-library/react'

import { QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { queryClient } from '~/lib/react_query'

import { expect, it } from 'vitest'

import { graphql, http, HttpResponse } from 'msw'
import { server } from 'tests/_setup'
import { useLiveTrains } from '../../hooks'
import { LocalizedStation } from '../../types'

const exampleParams = {
  count: 0,
  type: 'DEPARTURE' as const,
  localizedStations: [],
  stationShortCode: 'HKI'
}

const localizedStations: LocalizedStation[] = [
  {
    stationName: { fi: 'Helsinki', en: 'Helsinki', sv: 'Helsingfors' },
    stationShortCode: 'HKI',
    countryCode: 'FI',
    longitude: 24.941249,
    latitude: 60.172097
  },
  {
    stationName: { fi: 'Järvenpää', en: 'Järvenpää', sv: 'Träskända' },
    stationShortCode: 'JP',
    countryCode: 'FI',
    longitude: 25.090796,
    latitude: 60.473684
  }
]

const WRAPPER: RenderHookOptions<unknown>['wrapper'] = props => (
  <QueryClientProvider client={queryClient}>
    {props.children}
  </QueryClientProvider>
)

it('sets query key after called', () => {
  // Is empty initially
  expect(useLiveTrains.queryKey).toHaveLength(0)

  renderHook(() => useLiveTrains(exampleParams), { wrapper: WRAPPER })

  // Is of expected shape after the hook is called
  expect(useLiveTrains.queryKey).toStrictEqual([
    'trains',
    exampleParams.type,
    'HKI',
    0,
    undefined
  ])
})

it('sets query key after called for destination filter', () => {
  const filters = { destination: 'JP' }

  renderHook(() => useLiveTrains({ ...exampleParams, filters }), {
    wrapper: WRAPPER
  })

  expect(useLiveTrains.queryKey).toStrictEqual([
    'trains',
    exampleParams.type,
    'HKI',
    0,
    filters
  ])
})

it('is disabled when localized stations is empty', () => {
  const { result } = renderHook(() => useLiveTrains({ ...exampleParams }), {
    wrapper: WRAPPER
  })

  expect(result.current.fetchStatus).toBe('idle')
  expect(result.current.isFetching).toBe(false)
  expect(result.current.isFetched).toBe(false)
})

it('uses filtered trains function when filters are present', async () => {
  let calledEndpoint = false
  server.use(
    http.get(
      'https://rata.digitraffic.fi/api/v1/live-trains/station/HKI/JP',
      () => {
        calledEndpoint = true
        return HttpResponse.json([])
      }
    )
  )

  const { result } = renderHook(
    () =>
      useLiveTrains({
        ...exampleParams,
        localizedStations,
        filters: { destination: 'JP' }
      }),
    { wrapper: WRAPPER }
  )

  await waitFor(() => expect(result.current.isSuccess).toBe(true))

  expect(result.current.data).toStrictEqual([])
  expect(calledEndpoint).toBe(true)
})

it('uses fetch trains function when no filters are present', async () => {
  let calledEndpoint = false
  server.use(
    graphql.query('trains', () => {
      calledEndpoint = true
      return HttpResponse.json({ data: { trainsByStationAndQuantity: [] } })
    })
  )

  const { result } = renderHook(
    () =>
      useLiveTrains({
        ...exampleParams,
        localizedStations
      }),
    { wrapper: WRAPPER }
  )

  await waitFor(() => expect(result.current.isSuccess).toBe(true))

  expect(result.current.data).toStrictEqual([])
  expect(calledEndpoint).toBe(true)
})
