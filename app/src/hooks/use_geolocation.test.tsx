/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Locale } from '~/types/common'

import { type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { handlePosition, useGeolocation } from './use_geolocation'

type Props = Parameters<typeof handlePosition>[0]

/**
 * Mock functions, also see {@link createGetPositionMockFn}
 */
const onStations = vi.fn()
const onError = vi.fn()

const WRAPPER = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

beforeAll(() => {
  vi.mock('~/hooks/use_stations', () => ({
    useStations: () => {
      return {
        data: [
          {
            latitude: 1,
            longitude: 1,
            stationName: { en: 'i', fi: 'j', sv: 'k' },
          },
        ],
      }
    },
  }))
})

afterEach(() => {
  vi.clearAllMocks()
})

const PROPS: Props = {
  locale: 'fi',
  onStations,
  translations: {
    badGeolocationAccuracy: 'a',
    positionError: 'b',
    positionTimeout: 'c',
    positionUnavailable: 'd',
  },
  stations: [],
}

it('pushes a new route if accuracy is sufficient', () => {
  const getCurrentPosition = createGetPositionMockFn()

  const props: Props = {
    ...PROPS,
    stations: [
      {
        latitude: 2,
        longitude: 2,
        stationName: { en: 'i', fi: 'j', sv: 'k' } as Record<Locale, string>,
      },
    ],
  }

  handlePosition(props)

  expect(getCurrentPosition).toHaveBeenCalledOnce()
})

it('works without stations', () => {
  const getCurrentPosition = createGetPositionMockFn()

  handlePosition({ ...PROPS, stations: undefined })

  expect(getCurrentPosition).not.toHaveBeenCalled()
})

it('calls set stations with stations sorted by distance if accuracy is bad', () => {
  createGetPositionMockFn(10_000)

  const props: Props = {
    ...PROPS,
    stations: [
      {
        latitude: 2,
        longitude: 2,
        stationName: { [PROPS.locale]: 'a' } as any,
      },
      {
        latitude: 1,
        longitude: 1,
        stationName: { [PROPS.locale]: 'b' } as any,
      },
    ],
  }

  handlePosition(props)

  expect(onStations).toHaveBeenCalledWith(props.stations!.reverse())
})

it('calls toast with error', () => {
  createGetPositionMockFn(1, 'error')

  handlePosition(PROPS)

  expect(onError).toHaveBeenCalledOnce()
})

describe('hook', () => {
  beforeEach(() => {
    vi.mock('~/hooks/use_stations', () => ({
      useStations: vi.fn(() => ({
        data: [
          { stationName: { [PROPS.locale]: 'a' }, latitude: 1, longitude: 1 },
        ],
      })),
    }))
  })

  it('returns a function getCurrentPosition', () => {
    const { result } = renderHook(() => useGeolocation(PROPS), {
      wrapper: WRAPPER,
    })

    expect(Object.keys(result.current)).contain('getCurrentPosition')
  })

  it('calls get current position when invoked', () => {
    const { result } = renderHook(() => useGeolocation(PROPS), {
      wrapper: WRAPPER,
    })

    const getCurrentPosition = createGetPositionMockFn()
    result.current.getCurrentPosition()

    waitFor(() => {
      expect(getCurrentPosition).toHaveBeenCalledOnce()
    })
  })
})

function createGetPositionMockFn(accuracy = 1, type?: 'error') {
  const mock: Geolocation['getCurrentPosition'] = success => {
    if (type === 'error') {
      // error code from https://w3c.github.io/geolocation-api/#dom-geolocationpositionerror
      const PERMISSION_DENIED = 1

      onError({ code: PERMISSION_DENIED } as any)
    }

    success({
      coords: { accuracy, latitude: 1, longitude: 1 },
    } as any)
  }

  const getCurrentPosition = vi.fn(mock)

  vi.stubGlobal('navigator', {
    geolocation: {
      getCurrentPosition,
    },
  })

  return getCurrentPosition
}
