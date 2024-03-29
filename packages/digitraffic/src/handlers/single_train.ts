import type { Train } from '../types/train.js'
import type { HandlerOptions } from '../base/handler.js'

import { createFetch } from '../base/create_fetch.js'

interface GetSingleTrainOptions extends HandlerOptions {
  /**
   * Date in yyyy-mm-dd format. Can also be set to 'latest'.
   *
   * @see https://www.digitraffic.fi/rautatieliikenne/#yhden-junan-tiedot
   */
  date?: string | 'latest'
  trainNumber: number
  version?: number | string
}

export const fetchSingleTrain = async ({
  date,
  trainNumber,
  version,
  signal
}: GetSingleTrainOptions) => {
  const calendarDate = /^(\d{4})-(\d{2})-(\d{2})$/

  if (date && !(calendarDate.test(date) || date === 'latest')) {
    throw new TypeError(
      `Date didn't match RegExp ${calendarDate}, date should be in yyyy-mm-dd format.`
    )
  }

  if (!(typeof trainNumber === 'number' || typeof trainNumber === 'string')) {
    throw new TypeError(
      `Expected train number to be a number or a string, received ${typeof trainNumber}.`
    )
  }

  if (
    !Object.is(version, undefined) &&
    !(typeof version === 'number' || typeof version === 'string')
  ) {
    throw new TypeError(
      `Expected version to be a number or a string, received ${typeof version}.`
    )
  }

  const params = new URLSearchParams()

  if (version !== undefined) {
    params.append('version', `${version}`)
  }

  const defaultDate = date || 'latest'

  const trains: Train[] | undefined = await createFetch(
    `/trains/${defaultDate}/${trainNumber}`,
    {
      query: params,
      signal
    }
  )

  if (!trains || trains.length === 0) {
    return
  }
  return trains[0]
}
