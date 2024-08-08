import type { RenderHookOptions } from '@testing-library/react'

import { QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from 'tests/_setup'
import { expect, it } from 'vitest'

import { queryClient } from '~/lib/react_query'
import { useStations } from '../../hooks'

const WRAPPER: RenderHookOptions<unknown>['wrapper'] = props => (
  <QueryClientProvider client={queryClient}>
    {props.children}
  </QueryClientProvider>
)

it('should return stations', async () => {
  server.use(
    http.get('https://rata.digitraffic.fi/api/v1/metadata/stations', () => {
      return HttpResponse.json([])
    }),
  )

  const { result } = renderHook(() => useStations(), { wrapper: WRAPPER })

  await waitFor(() => expect(result.current.data).toEqual([]))
})
