import type { LocalizedStation } from '@lib/digitraffic'

import { useQuery } from '@tanstack/react-query'

import translate from '~/utils/translate'

import { stations } from '../queries/stations'
import { translateStations, normalizedStations } from '../helpers/station'
import { client } from '../helpers/graphql_request'

export const useStations = () => {
  return useQuery<LocalizedStation[]>(
    ['stations '],
    async () => {
      const result = await client.request(stations)

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
