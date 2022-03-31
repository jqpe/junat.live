import type { BaseQueryFn } from '@reduxjs/toolkit/query/react'
import type { GetTrainsOptions, Train } from '~digitraffic'

import { createApi } from '@reduxjs/toolkit/query/react'
import { getLiveTrains } from '~digitraffic'

interface TrainsEndpoint {
  options?: GetTrainsOptions
  stationShortCode: string
}

const trainsBaseQuery: BaseQueryFn<TrainsEndpoint> = async ({
  options,
  stationShortCode
}) => {
  try {
    const trains = await getLiveTrains(stationShortCode, options)

    return { data: trains }
  } catch (error) {
    return { error }
  }
}

export const digitrafficApi = createApi({
  reducerPath: 'digitraffic',
  baseQuery: trainsBaseQuery,
  endpoints(build) {
    return {
      trains: build.query<Train[], TrainsEndpoint>({
        query: options => options
      })
    }
  }
})

export const { useTrainsQuery } = digitrafficApi
