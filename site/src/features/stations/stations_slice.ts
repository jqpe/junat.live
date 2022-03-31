import type { BaseQueryFn } from '@reduxjs/toolkit/query/react'
import type { LocalizedStation } from '~digitraffic'

import { getStations } from '~digitraffic'

import { createApi } from '@reduxjs/toolkit/query/react'

const stationsBaseQuery: BaseQueryFn = async () => {
  try {
    const stations = await getStations<LocalizedStation[]>({
      omitInactive: false,
      locale: ['fi', 'en', 'sv']
    })

    return { data: stations }
  } catch (error) {
    return { error }
  }
}

export const stationsApi = createApi({
  reducerPath: 'stations',
  baseQuery: stationsBaseQuery,
  endpoints(build) {
    return {
      stations: build.query<LocalizedStation[], void>({
        query: () => undefined,
        keepUnusedDataFor: Infinity,
        transformResponse: response => {
          if (typeof response === 'undefined') {
            return []
          }
          return response as LocalizedStation[]
        }
      })
    }
  }
})

export const { useStationsQuery } = stationsApi
