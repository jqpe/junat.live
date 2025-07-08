import type { SingleTrainFragment } from '@junat/graphql/digitraffic'

import { renderHook, waitFor } from '@testing-library/react'
import { beforeAll, expect, it, vi } from 'vitest'

import train from '@junat/digitraffic-mqtt/mocks/train.json'

import { useSingleTrainSubscription } from '../../src/digitraffic/use_single_train_subscription'

const INITIAL_TRAIN = {
  trainNumber: train.trainNumber,
  departureDate: train.departureDate,
  version: '',
} satisfies Partial<SingleTrainFragment> as SingleTrainFragment

const trainTestId = crypto.randomUUID()

beforeAll(() => {
  vi.mock('@junat/digitraffic-mqtt', async () => {
    const createGenerator = async function* () {
      yield Promise.resolve({
        ...INITIAL_TRAIN,
        [trainTestId]: true,
      })
    }

    return {
      subscribeToTrains: vi.fn(async () => ({
        close: vi.fn(),
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
  // Errors thrown inside Reacts render lifecycle aren't reflected —
  // in other words `renderHook` will not throw if the hook throws.

  const error = result.current[1]

  expect(error).toBeInstanceOf(TypeError)
})

it('closes the connection on unmount', async () => {
  const { result, unmount } = renderHook(() => {
    return useSingleTrainSubscription({
      initialTrain: INITIAL_TRAIN,
    })
  })

  // Client is connected
  await waitFor(() => expect(result.current[2]).toBeDefined())

  unmount()

  expect(result.current[2]?.close).toHaveBeenCalledOnce()
})

it('yields new trains', async () => {
  const { result, unmount } = renderHook(() => {
    return useSingleTrainSubscription({
      initialTrain: INITIAL_TRAIN,
    })
  })

  // Client is connected
  await waitFor(() => expect(result.current[2]).toBeDefined())

  unmount()

  expect(result.current[0]).not.toStrictEqual(INITIAL_TRAIN)
})

it('returns initial train after it has been changed', async () => {
  const { result, rerender } = renderHook(props => {
    return useSingleTrainSubscription({
      initialTrain: INITIAL_TRAIN,
      ...(props as any),
    })
  })

  // Client is connected
  await waitFor(() => expect(result.current[2]).toBeDefined())

  // Updated with MQTT train
  expect(result.current[0]).not.toStrictEqual(INITIAL_TRAIN)

  // Initial train was changed
  rerender({ initialTrain: { ...INITIAL_TRAIN, cancelled: true } })

  // Result train is a combination of the two
  await waitFor(() => {
    expect(result.current[0]).toStrictEqual({
      ...INITIAL_TRAIN,

      // NOTE: These fields get default values even if not in the INITIAL_TRAIN object

      commuterLineid: null,
      timeTableRows: [],
      trainType: {
        name: undefined,
      },

      cancelled: true,
      [trainTestId]: true,
    })
  })
})
