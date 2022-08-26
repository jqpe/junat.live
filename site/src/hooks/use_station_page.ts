import type { StoreApi, UseBoundStore } from 'zustand'

import create from 'zustand'

export interface StationPageStore {
  /**
   * Count is stored inside an object with `key` as the key to access it.
   */
  getCount: (key: string) => number
  setCount: (count: number, path: string) => void
  currentShortCode?: string
  setCurrentShortCode: (code: string) => void
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
    currentShortCode: undefined,
    setCurrentShortCode: (code: string) => {
      set(store => ({ ...store, currentShortCode: code }))
    },
    getCount: (key: string) => {
      return get().stations[key] || 0
    },
    setCount: (count, path) =>
      set(() => ({
        stations: Object.assign(get().stations, { [path]: count })
      }))
  }))
