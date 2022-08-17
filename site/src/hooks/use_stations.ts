import { fetchStations } from '@junat/digitraffic'
import { useQuery } from '@tanstack/react-query'

const getStations = async () => {
  return fetchStations({
    omitInactive: false,
    includeNonPassenger: false,
    locale: ['fi', 'en', 'sv']
  })
}

export const useStations = () => {
  return useQuery(['stations'], getStations)
}
