import { useQuery } from '@tanstack/react-query'

import { normalizeSingleTrain, singleTrain } from '../queries/single_train'

import { getCalendarDate } from '~/utils/date'
import { client } from '../helpers/graphql_request'

type Late<T> = T | undefined

/**
 * Fetch single train data. The request will not be sent unless the trainNumber and departureDate are defined.
 */
export const useSingleTrain = (opts: {
  trainNumber: Late<number>
  departureDate: Late<string>
}) => {
  const { trainNumber } = opts

  let departureDate = opts.departureDate

  if (opts.departureDate === 'latest') {
    // The GraphQL API doesn't support the ambiguous 'latest' value found in the RESTful API.
    departureDate = getCalendarDate(new Date().toISOString())
  }

  return useQuery(
    ['train', departureDate, trainNumber],
    async () => {
      if (!(departureDate && trainNumber)) {
        throw new TypeError(
          'departureDate and trainNumber should both be defined'
        )
      }

      const result = await client.request(singleTrain, {
        departureDate,
        trainNumber
      })

      if (!result.train) {
        throw new TypeError('train was undefined')
      }

      type NonNullTrains = NonNullable<(typeof result.train)[number]>[]

      return normalizeSingleTrain(
        <NonNullTrains>result.train.filter(train => train !== null)
      )
    },
    {
      enabled: Boolean(trainNumber && departureDate)
    }
  )
}
