import type { LocalizedStation } from '@lib/digitraffic'

import request from 'graphql-request'
import { useQuery } from '@tanstack/react-query'

import translate from '~/utils/translate'

import { stations } from '../queries/stations'
import { translateStations, normalizedStations } from '../helpers/station'

const DIGITRAFFIC = 'https://rata.digitraffic.fi/api/v2/graphql/graphql'

export const useStations = () => {
  return useQuery<LocalizedStation[]>(
    ['stations '],
    async () => {
      const result = await request(DIGITRAFFIC, stations)

      return translateStations(
        normalizedStations(result.stations),
        translate('all')('stations')
      )
    },
    {
      cacheTime: Infinity
    }
  )
}
