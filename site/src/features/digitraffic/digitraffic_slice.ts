import type { BaseQueryFn } from '@reduxjs/toolkit/query/react'
import type { GetTrainsOptions, LocalizedStation } from '~digitraffic'

import { createApi } from '@reduxjs/toolkit/query/react'
import { getLiveTrains } from '~digitraffic'

import { simplifyTrains } from '@utils/simplify_train'
import { SimplifiedTrain } from '@typings/simplified_train'

interface TrainsEndpoint {
  options?: GetTrainsOptions
  stationShortCode: string
  stations: LocalizedStation[]
}

const trainsBaseQuery: BaseQueryFn<TrainsEndpoint> = async ({
  options,
  stationShortCode,
  stations
}) => {
  try {
    const trains = await getLiveTrains(stationShortCode, options)

    return { data: simplifyTrains(trains, stationShortCode, stations) }
  } catch (error) {
    return { error }
  }
}

export const digitrafficApi = createApi({
  reducerPath: 'digitraffic',
  baseQuery: trainsBaseQuery,
  endpoints(build) {
    return {
      trains: build.query<SimplifiedTrain[], TrainsEndpoint>({
        query: options => options
      })
    }
  }
})

export const { useTrainsQuery } = digitrafficApi
