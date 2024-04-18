import { QueryClientProvider } from '@tanstack/react-query'
import { renderHook, type RenderHookOptions } from '@testing-library/react'
import { expect, it } from 'vitest'
import { queryClient } from '~/lib/react_query'

import { useLiveTrains } from '../../hooks'

const exampleParams = {
  count: 0,
  localizedStations: [],
  stationShortCode: 'HKI'
}

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
  expect(useLiveTrains.queryKey).toStrictEqual(['trains/HKI', 0, undefined])
})

it('sets query key after called for destination filter', () => {
  const filters = { destination: 'JPA' }

  renderHook(() => useLiveTrains({ ...exampleParams, filters }), {
    wrapper: WRAPPER
  })

  expect(useLiveTrains.queryKey).toStrictEqual(['trains/HKI', 0, filters])
})

it('is disabled when localized stations is empty', () => {
  const { result } = renderHook(() => useLiveTrains({ ...exampleParams }), {
    wrapper: WRAPPER
  })

  expect(result.current.fetchStatus).toBe('idle')
  expect(result.current.isFetching).toBe(false)
  expect(result.current.isFetched).toBe(false)
})
