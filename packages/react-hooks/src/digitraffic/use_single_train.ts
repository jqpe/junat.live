import type { UseQueryResult } from '@tanstack/react-query'

import { useQuery } from '@tanstack/react-query'

import { getCalendarDate } from '@junat/core/utils/date'
import {
  normalizeSingleTrain,
  singleTrain,
} from '@junat/graphql/digitraffic/queries/single_train'
import { client } from '@junat/graphql/graphql-request'

type Late<T> = T | undefined

/**
 * Fetch single train data. The request will not be sent unless the trainNumber and departureDate are defined.
 */
export const useSingleTrain = (opts: {
  trainNumber: Late<number>
  departureDate: Late<string>
}): UseQueryResult<Awaited<ReturnType<typeof fetchSingleTrain>>> => {
  const { trainNumber } = opts

  let departureDate = opts.departureDate

  if (opts.departureDate === 'latest') {
    // The GraphQL API doesn't support the ambiguous 'latest' value found in the RESTful API.
    departureDate = getCalendarDate(new Date().toISOString())
  }

  return useQuery({
    queryKey: ['train', departureDate, trainNumber],
    queryFn: () => fetchSingleTrain(departureDate, trainNumber),
    enabled: Boolean(trainNumber && departureDate),
    staleTime: 5 * 60 * 1000, // 5 minutes,
    refetchInterval: 2 * 60 * 1000, // 2 minutes,
    refetchOnWindowFocus: true,
  })
}

/**
 * @private Fetches a single train for `departureDate` and `trainNumber`.
 *
 * @throws if either of the arguments is undefined.
 */
export const fetchSingleTrain = async (
  departureDate: Late<string>,
  trainNumber: Late<number>,
): Promise<ReturnType<typeof normalizeSingleTrain> | null> => {
  if (!(departureDate && trainNumber)) {
    throw new TypeError('departureDate and trainNumber should both be defined')
  }

  const result = await client.request(singleTrain, {
    departureDate,
    trainNumber,
  })

  // No train
  if (!result.train || result.train.length === 0) {
    return null
  }

  type NonNullTrains = NonNullable<(typeof result.train)[number]>[]

  return normalizeSingleTrain(
    <NonNullTrains>result.train.filter(train => train !== null),
  )
}
