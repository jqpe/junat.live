import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { digitransitClient } from '@junat/graphql/graphql-request'

import { fetchAlerts, useAlerts } from '../../src/digitransit/alerts'

type StubGqlClient = any

vi.mock('@junat/graphql/graphql-request', () => ({
  digitransitClient: vi.fn(() => ({
    request: vi.fn(),
  })),
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useAlerts', () => {
  it('returns null when no alerts are found', async () => {
    const mockRequest = vi.fn().mockResolvedValue({ stations: [] })
    vi.mocked(digitransitClient).mockImplementation(
      () =>
        ({
          request: mockRequest,
        }) as StubGqlClient,
    )

    const { result } = renderHook(
      () => useAlerts({ station: 'Helsinki', apiKey: 'test-key' }),
      { wrapper },
    )

    await waitFor(() => {
      expect(result.current.data).toBeNull()
    })
  })

  it('returns alerts when found for a station', async () => {
    const mockAlerts = [{ id: 1, description: 'Test alert' }]
    const mockRequest = vi.fn().mockResolvedValue({
      stations: [
        {
          stops: [
            {
              alerts: mockAlerts,
            },
          ],
        },
      ],
    })
    vi.mocked(digitransitClient).mockImplementation(
      () =>
        ({
          request: mockRequest,
        }) as StubGqlClient,
    )

    const { result } = renderHook(
      () =>
        useAlerts({ station: 'Helsinki', apiKey: 'test-key', locale: 'fi' }),
      { wrapper },
    )

    await waitFor(() => {
      expect(result.current.data).toEqual(mockAlerts)
    })
  })
})

describe('fetchAlerts', () => {
  it('handles empty stops array', async () => {
    const mockRequest = vi.fn().mockResolvedValue({
      stations: [{ stops: [] }],
    })
    vi.mocked(digitransitClient).mockImplementation(
      () =>
        ({
          request: mockRequest,
        }) as StubGqlClient,
    )

    const result = await fetchAlerts({
      station: 'Helsinki',
      apiKey: 'test-key',
    })
    expect(result).toBeNull()
  })

  it('handles undefined stations', async () => {
    const mockRequest = vi.fn().mockResolvedValue({
      stations: undefined,
    })
    vi.mocked(digitransitClient).mockImplementation(
      () =>
        ({
          request: mockRequest,
        }) as StubGqlClient,
    )

    const result = await fetchAlerts({
      station: 'Helsinki',
      apiKey: 'test-key',
    })
    expect(result).toBeNull()
  })

  it('includes locale in request headers when provided', async () => {
    const mockRequest = vi.fn().mockResolvedValue({ stations: [] })
    vi.mocked(digitransitClient).mockImplementation(
      () =>
        ({
          request: mockRequest,
        }) as StubGqlClient,
    )

    await fetchAlerts({
      station: 'Helsinki',
      apiKey: 'test-key',
      locale: 'en',
    })

    expect(mockRequest).toHaveBeenCalledWith(
      expect.anything(),
      { station: 'Helsinki' },
      { 'accept-language': 'en' },
    )
  })
})
