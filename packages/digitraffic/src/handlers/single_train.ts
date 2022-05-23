interface GetSingleTrainOptions {
  /**
   * Date in yyyy-mm-dd format. Can also be set to 'latest'.
   *
   * @see https://www.digitraffic.fi/rautatieliikenne/#yhden-junan-tiedot
   */
  date?: string | 'latest'
  trainNumber: number
  version?: string
}

export const getSingleTrain = async ({
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
    version &&
    !(typeof version === 'number' || typeof version === 'string')
  ) {
    throw new TypeError(
      `Expected version to be a number or a string, received ${typeof version}.`
    )
  }

  const params = new URLSearchParams({
    version: version ? `${version}` : ''
  })

  const trains = await fetch(
    `https://rata.digitraffic.fi/api/v1/trains/${
      date || 'latest'
    }/${trainNumber}?${params}`
  )

  return await trains.json()
}
