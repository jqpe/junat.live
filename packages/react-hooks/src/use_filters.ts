import { parseAsString, useQueryState } from 'nuqs'

/**
 * Hook to interface with filters specific for a station page.
 * Filters trains to show only those that stop at the specified station.
 * Filters are persisted with query parameters.
 */
export const useStationFilters = () => {
  const [stopStation, setStopStation] = useQueryState('stop', parseAsString)

  return {
    /** Station short code to filter trains by (shows only trains that stop at this station) */
    stopStation,
    setStopStation,
  }
}
