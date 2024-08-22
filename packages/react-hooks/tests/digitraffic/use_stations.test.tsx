import type { RenderHookOptions } from '@testing-library/react'

import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { expect, it } from 'vitest'

import { useStations } from '../../src/digitraffic/use_stations'
import { server } from '../../test_setup'

const WRAPPER: RenderHookOptions<unknown>['wrapper'] = props => (
  <QueryClientProvider client={new QueryClient()}>
    {props.children}
  </QueryClientProvider>
)

it('should return stations', async () => {
  server.use(
    http.get('https://rata.digitraffic.fi/api/v1/metadata/stations', () => {
      return HttpResponse.json([])
    }),
  )

  const { result } = renderHook(() => useStations({ t: (() => {}) as any }), {
    wrapper: WRAPPER,
  })

  await waitFor(() => expect(result.current.data).toEqual([]))
})
