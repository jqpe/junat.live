import { useSingleTrainSubscription } from '../../hooks/use_single_train_subscription'

import { expect, it } from 'vitest'
import { renderHook, RenderHookOptions, waitFor } from '@testing-library/react'
import { Train } from '@junat/digitraffic/types'

import train from '@junat/digitraffic-mqtt/mocks/train.json'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const INITIAL_TRAIN = {
  trainNumber: train.trainNumber,
  departureDate: train.departureDate
} as Readonly<Train>

const WRAPPER: RenderHookOptions<unknown>['wrapper'] = props => (
  <QueryClientProvider client={new QueryClient()}>
    {props.children}
  </QueryClientProvider>
)

it('returns initial train after subscribing', () => {
  const { result, unmount } = renderHook(
    () => {
      return useSingleTrainSubscription({
        initialTrain: INITIAL_TRAIN
      })
    },
    {
      wrapper: WRAPPER
    }
  )

  expect(result.current?.[0]).toStrictEqual(INITIAL_TRAIN)

  unmount()
})

const A_MINUTE = 60_000 as const

it(
  'yields new trains',
  async () => {
    const MILLISECOND = 1 as const

    const { result, unmount } = renderHook(
      () => useSingleTrainSubscription({ initialTrain: INITIAL_TRAIN }),
      { wrapper: WRAPPER }
    )

    await waitFor(
      () => {
        expect(result.current[0]).not.toStrictEqual(INITIAL_TRAIN)
      },
      {
        interval: 100 * MILLISECOND,
        // Reserve a small buffer for rendering
        timeout: 0.95 * A_MINUTE
      }
    )

    unmount()
  },
  A_MINUTE
)

it('throws if `enabled` is true but `initialTrain` is undefined', () => {
  const { result } = renderHook(
    () =>
      useSingleTrainSubscription({ initialTrain: undefined, enabled: true }),
    { wrapper: WRAPPER }
  )

  // We're using the returned error as opposed to testing that the hook throws.
  // Errors thrown inside Reacts render lifecycle aren't reflected —
  // in other words `renderHook` will not throw if the hook throws.

  const error = result.current[1]

  expect(error).toBeInstanceOf(TypeError)
})
