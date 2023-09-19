import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesStore {
  favorites: StationShortCode[]
  isFavorite: (station: StationShortCode) => boolean
  addFavorite: (station: StationShortCode) => boolean
  removeFavorite: (station: StationShortCode) => boolean
}

type StationShortCode = string

/**
 * Hook to interface with favorite stations stored in local storage. Station shortcodes are stored.
 */
export const useFavorites = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: <string[]>[],
      isFavorite(station: StationShortCode) {
        return get().favorites.includes(station)
      },
      addFavorite(station: StationShortCode) {
        if (!this.isFavorite(station)) {
          set({ favorites: [...get().favorites, station] })
          return true
        }
        return false
      },
      removeFavorite(station: StationShortCode) {
        if (this.isFavorite(station)) {
          set({ favorites: get().favorites.filter(s => s !== station) })
          return true
        }

        return false
      }
    }),
    {
      name: 'favorites-storage'
    }
  )
)
