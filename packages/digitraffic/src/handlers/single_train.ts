import type { Train } from '../../types/train'
import { createHandler } from '../base/create_handler'

interface GetSingleTrainOptions {
  /**
   * Date in yyyy-mm-dd format. Can also be set to 'latest'.
   *
   * @see https://www.digitraffic.fi/rautatieliikenne/#yhden-junan-tiedot
   */
  date?: string | 'latest'
  trainNumber: number
  version?: number | string
}

const singleTrain = async ({
  date,
  trainNumber,
  version
}: GetSingleTrainOptions) => {
  const yyyyMmDd = /^(\d{4})-(\d{2})-(\d{2})$/

  if (date && !(yyyyMmDd.test(date) || date === 'latest')) {
    throw new TypeError(
      `Date didn't match RegExp ${yyyyMmDd}, date should be in yyyy-mm-dd format.`
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

  let url = `https://rata.digitraffic.fi/api/v1/trains/${defaultDate}/${trainNumber}`

  if (`${params}` !== '') {
    url += `?${params}`
  }

  const trains = await fetch(url)

  const json: Train[] = await trains.json()

  if (json.length === 0) {
    return
  }
  return json[0]
}

export const getSingleTrain = createHandler(singleTrain)
