import type { StoreApi, UseBoundStore } from 'zustand'

import create from 'zustand'

export interface StationPageStore {
  /**
   * Count is stored inside an object with `path` as the key to access it.
   */
  getCount: (path: string) => number
  setCount: (count: number, path: string) => void
}

interface Store extends StationPageStore {
  readonly stations: Record<string, number | undefined>
}

/**
 * Hook for storing data for multiple stations.
 */
export const useStationPage: UseBoundStore<StoreApi<StationPageStore>> =
  create<Store>((set, get) => ({
    stations: {},
    getCount: (key: string) => {
      return get().stations[key] || 0
    },
    setCount: (count, path) =>
      set(() => ({
        stations: { [path]: count }
      }))
  }))
