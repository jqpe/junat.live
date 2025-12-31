import type { UseQueryResult } from '@tanstack/react-query'
import type { SingleTrainFragment } from '@junat/graphql/digitraffic'

import { useQuery } from '@tanstack/react-query'

import { getCalendarDate } from '@junat/core/utils/date'
import { singleTrain } from '@junat/graphql/digitraffic/queries/single_train'
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

  useSingleTrain.queryKey = ['train', departureDate, trainNumber]

  return useQuery({
    queryKey: useSingleTrain.queryKey,
    queryFn: () => fetchSingleTrain(departureDate, trainNumber),
    enabled: Boolean(trainNumber && departureDate),
    staleTime: 5 * 60 * 1000, // 5 minutes,
    refetchInterval: 2 * 60 * 1000, // 2 minutes,
    refetchOnWindowFocus: true,
  })
}

useSingleTrain.queryKey = [] as unknown[]

/**
 * @private Fetches a single train for `departureDate` and `trainNumber`.
 *
 * @throws if either of the arguments is undefined.
 */
export const fetchSingleTrain = async (
  departureDate: Late<string>,
  trainNumber: Late<number>,
): Promise<SingleTrainFragment | null> => {
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

  return result.train.find(train => train != null) || null
}
