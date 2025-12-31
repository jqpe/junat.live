import type { SingleTrainFragment } from '@junat/graphql/digitraffic'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeAll, beforeEach, expect, it, vi } from 'vitest'

import { subscribeToTrains } from '@junat/digitraffic-mqtt'
import train from '@junat/digitraffic-mqtt/mocks/train.json'

import { useSingleTrain } from '../../src/digitraffic/use_single_train'
import { useSingleTrainSubscription } from '../../src/digitraffic/use_single_train_subscription'

const INITIAL_TRAIN = {
  trainNumber: train.trainNumber,
  departureDate: train.departureDate,
  version: '',
} satisfies Partial<SingleTrainFragment> as SingleTrainFragment

const trainTestId = crypto.randomUUID()

const createGenerator = async function* () {
  yield {
    ...INITIAL_TRAIN,
    [trainTestId]: true,
  }
}

let queryClient: QueryClient

beforeEach(() => {
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
})

beforeAll(() => {
  vi.mock('@junat/core/utils/train', async () => ({
    convertTrain: vi.fn(train => train),
  }))
  vi.mock('@junat/digitraffic-mqtt', async () => {
    return {
      subscribeToTrains: vi.fn(async () => ({
        unsubscribe: vi.fn(),
        trains: createGenerator(),
      })),
    }
  })
})

it('updates cache with initial train after subscribing', async () => {
  // Set initial data in cache
  queryClient.setQueryData(useSingleTrain.queryKey, INITIAL_TRAIN)

  const { unmount } = renderHook(
    () => {
      return useSingleTrainSubscription({
        initialTrain: INITIAL_TRAIN,
      })
    },
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    },
  )

  // Wait for subscription to update cache
  await waitFor(() => {
    const cachedTrain = queryClient.getQueryData<SingleTrainFragment>(
      useSingleTrain.queryKey,
    )
    expect(cachedTrain).toHaveProperty(trainTestId, true)
  })

  unmount()
})

it('does not throw if `enabled` is true but `initialTrain` is undefined', () => {
  const { result } = renderHook(
    () =>
      useSingleTrainSubscription({ initialTrain: undefined, enabled: true }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    },
  )

  // Hook should handle undefined gracefully and not throw
  expect(result.current).toBeUndefined()
})

it('unsubscribes on unmount', async () => {
  const mockUnsubscribe = vi.fn()
  const mockReturn = vi.fn()

  const generator = (async function* () {
    yield {
      ...INITIAL_TRAIN,
      [trainTestId]: true,
    }
  })()
  generator.return = mockReturn as any

  vi.mocked(subscribeToTrains).mockResolvedValueOnce({
    topic: 'test-topic',
    unsubscribe: mockUnsubscribe as any,
    trains: generator as any,
    close: vi.fn() as any,
    mqttClient: {} as any,
  })

  const { unmount } = renderHook(
    () => {
      return useSingleTrainSubscription({
        initialTrain: INITIAL_TRAIN,
      })
    },
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    },
  )

  // Allow subscription to be created
  await waitFor(() => {
    expect(subscribeToTrains).toHaveBeenCalled()
  })

  unmount()

  await waitFor(() => {
    expect(mockReturn).toHaveBeenCalled()
    expect(mockUnsubscribe).toHaveBeenCalledOnce()
  })
})

it('updates cache with new trains', async () => {
  // Set initial data in cache
  queryClient.setQueryData(useSingleTrain.queryKey, INITIAL_TRAIN)

  renderHook(
    () => {
      return useSingleTrainSubscription({
        initialTrain: INITIAL_TRAIN,
      })
    },
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    },
  )

  await waitFor(() => {
    const cachedTrain = queryClient.getQueryData<SingleTrainFragment>(
      useSingleTrain.queryKey,
    )
    expect(cachedTrain).not.toStrictEqual(INITIAL_TRAIN)
    expect(cachedTrain).toHaveProperty(trainTestId, true)
  })
})

it('merges updated train with cached train', async () => {
  const testId = crypto.randomUUID()
  const modifiedTrain = { ...INITIAL_TRAIN, cancelled: true, [testId]: true }

  // Set initial data in cache
  queryClient.setQueryData(useSingleTrain.queryKey, modifiedTrain)

  const { rerender } = renderHook(
    (props: { initialTrain: SingleTrainFragment }) => {
      return useSingleTrainSubscription({
        initialTrain: props.initialTrain,
      })
    },
    {
      initialProps: { initialTrain: INITIAL_TRAIN },
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    },
  )

  // Wait for MQTT update
  await waitFor(() => {
    const cachedTrain = queryClient.getQueryData<SingleTrainFragment>(
      useSingleTrain.queryKey,
    )
    expect(cachedTrain).toHaveProperty(trainTestId, true)
  })

  // Rerender with updated initial train
  rerender({ initialTrain: modifiedTrain })

  // Cache should have merged properties
  await waitFor(() => {
    const cachedTrain = queryClient.getQueryData<SingleTrainFragment>(
      useSingleTrain.queryKey,
    )
    expect(cachedTrain?.cancelled).toBe(true)
    expect(cachedTrain).toHaveProperty(testId, true)
    expect(cachedTrain).toHaveProperty(trainTestId, true)
  })
})
