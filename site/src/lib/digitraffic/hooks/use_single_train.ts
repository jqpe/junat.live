import { fetchSingleTrain } from '@junat/digitraffic'
import { useQuery } from '@tanstack/react-query'

type Late<T> = T | undefined

/**
 * Fetch single train data. The request will not be sent unless the trainNumber and departureDate are defined.
 */
export const useSingleTrain = (opts: {
  trainNumber: Late<number>
  departureDate: Late<string>
}) => {
  const { trainNumber, departureDate } = opts

  return useQuery(
    ['train', departureDate, trainNumber],
    async () => {
      if (!(departureDate && trainNumber)) {
        throw new TypeError(
          'departureDate and trainNumber should both be defined'
        )
      }

      return fetchSingleTrain({
        trainNumber,
        date: departureDate
      })
    },
    {
      enabled: Boolean(trainNumber && departureDate)
    }
  )
}
