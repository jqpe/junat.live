import type { BaseQueryFn } from '@reduxjs/toolkit/query/react'
import type { SimplifiedTrain } from '@typings/simplified_train'
import type { GetTrainsOptions, LocalizedStation } from '~digitraffic'

import { store } from '../../app/store'

import { createApi } from '@reduxjs/toolkit/query/react'
import { getLiveTrains } from '~digitraffic'

import { simplifyTrains } from '@utils/simplify_train'

interface TrainsEndpoint {
  options?: GetTrainsOptions
  stationShortCode: string
}

const trainsBaseQuery: BaseQueryFn<TrainsEndpoint> = async ({
  options,
  stationShortCode
}) => {
  try {
    const { stations } = store.getState()

    const localizedStations = stations.queries['stations(undefined)']
      ?.data as LocalizedStation[]

    if (!localizedStations) {
      throw new Error("Stations weren't initialized.")
    }

    const trains = await getLiveTrains(stationShortCode, options)

    return { data: simplifyTrains(trains, stationShortCode, localizedStations) }
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
