import { create } from 'zustand'

interface FiltersStore {
  destination: StationShortCode | null
  actions: {
    setDestination: (destination: string) => void
  }
}

type StationShortCode = string

/**
 * Hook to interface with filters.
 */
export const useFilters = create<FiltersStore>(set => ({
  destination: null,
  actions: {
    setDestination(destination) {
      const actual = destination === '' ? null : destination
      set(store => ({ ...store, destination: actual }))
    }
  }
}))
