import type { LocalizedStation } from '@lib/digitraffic'

import request from 'graphql-request'
import { useQuery } from '@tanstack/react-query'

import translate from '~/utils/translate'

import { stations } from '../queries/stations'
import { translateStations, normalizedStations } from '../helpers/station'
import { DIGITRAFFIC_GRAPHQL_ENDPOINT } from '../helpers/constants'

export const useStations = () => {
  return useQuery<LocalizedStation[]>(
    ['stations '],
    async () => {
      const result = await request(DIGITRAFFIC_GRAPHQL_ENDPOINT, stations)

      if (!result.stations) {
        throw new TypeError('stations should not be undefined')
      }

      type NonNullStations = NonNullable<(typeof result.stations)[number]>[]

      return translateStations(
        normalizedStations(
          <NonNullStations>result.stations.filter(station => {
            if (station === null) {
              throw new TypeError('station was null')
            }

            return station
          })
        ),
        translate('all')('stations')
      )
    },
    {
      staleTime: Infinity
    }
  )
}
