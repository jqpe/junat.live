import { createWithEqualityFn } from 'zustand/traditional'

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
export const useFilters = createWithEqualityFn<FiltersStore>(set => ({
  destination: null,
  actions: {
    setDestination(destination) {
      const actual = destination === '' ? null : destination ?? null
      set(store => ({ ...store, destination: actual }))
    }
  }
}))
