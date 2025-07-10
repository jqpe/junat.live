import type { SingleTrainFragment } from '@junat/graphql/digitraffic'

import { renderHook, waitFor } from '@testing-library/react'
import { beforeAll, expect, it, vi } from 'vitest'

import { subscribeToTrains } from '@junat/digitraffic-mqtt'
import train from '@junat/digitraffic-mqtt/mocks/train.json'

import { useSingleTrainSubscription } from '../../src/digitraffic/use_single_train_subscription'

const INITIAL_TRAIN = {
  trainNumber: train.trainNumber,
  departureDate: train.departureDate,
  version: '',
} satisfies Partial<SingleTrainFragment> as SingleTrainFragment

const trainTestId = crypto.randomUUID()

const createGenerator = async function* () {
  yield Promise.resolve({
    ...INITIAL_TRAIN,
    [trainTestId]: true,
  })
}

beforeAll(() => {
  vi.mock('@junat/core/utils/train', async () => ({ convertTrain: vi.fn() }))
  vi.mock('@junat/digitraffic-mqtt', async () => {
    return {
      subscribeToTrains: vi.fn(async () => ({
        unsubscribe: vi.fn(),
        trains: createGenerator(),
      })),
    }
  })
})

it('returns initial train after subscribing', () => {
  const { result, unmount } = renderHook(() => {
    return useSingleTrainSubscription({
      initialTrain: INITIAL_TRAIN,
    })
  })

  expect(result.current?.[0]).toStrictEqual(INITIAL_TRAIN)

  unmount()
})

it('throws if `enabled` is true but `initialTrain` is undefined', () => {
  const { result } = renderHook(() =>
    useSingleTrainSubscription({ initialTrain: undefined, enabled: true }),
  )

  // We're using the returned error as opposed to testing that the hook throws.
  // `renderHook` will not throw if the hook throws.

  const error = result.current[1]

  expect(error).toBeInstanceOf(TypeError)
})

it('unsubscribes on unmount', async () => {
  const mockUnsubscribe = vi.fn()

  vi.mocked(subscribeToTrains).mockResolvedValueOnce({
    unsubscribe: mockUnsubscribe,
    // @ts-expect-error lsls
    trains: createGenerator(),
  })

  const { result, unmount } = renderHook(() => {
    return useSingleTrainSubscription({
      initialTrain: INITIAL_TRAIN,
    })
  })

  unmount()

  waitFor(() => expect(mockUnsubscribe).toHaveBeenCalledOnce())
})

it('yields new trains', async () => {
  const { result } = renderHook(() => {
    return useSingleTrainSubscription({
      initialTrain: INITIAL_TRAIN,
    })
  })

  waitFor(() => expect(result.current[0]).not.toStrictEqual(INITIAL_TRAIN))
})

it('returns initial train after it has been changed', async () => {
  const { result, rerender } = renderHook(props => {
    return useSingleTrainSubscription({
      initialTrain: INITIAL_TRAIN,
      ...(props as any),
    })
  })

  // Updated with MQTT train
  waitFor(() => expect(result.current[0]).not.toStrictEqual(INITIAL_TRAIN))

  // Initial train was changed
  const testId = crypto.randomUUID()

  rerender({
    initialTrain: { ...INITIAL_TRAIN, cancelled: true, [testId]: true },
  })

  // Result train is a combination of the two
  await waitFor(() => {
    expect(result.current[0]).toStrictEqual({
      ...INITIAL_TRAIN,
      cancelled: true,
      [testId]: true,
    })
  })
})
