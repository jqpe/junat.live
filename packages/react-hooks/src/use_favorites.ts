import { persist } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

interface FavoritesStore {
  favorites: StationShortCode[]
  homePageDefaultList: boolean
  setHomePageDefaultList: (value: boolean) => void
  isFavorite: (station: StationShortCode) => boolean
  addFavorite: (station: StationShortCode) => boolean
  removeFavorite: (station: StationShortCode) => boolean
}

type StationShortCode = string

/**
 * Hook to interface with favorite stations stored in local storage. Station shortcodes are stored.
 */
export const useFavorites = createWithEqualityFn<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: <string[]>[],
      setHomePageDefaultList: value => set({ homePageDefaultList: value }),
      homePageDefaultList: false,
      isFavorite(station: StationShortCode) {
        return get().favorites.includes(station)
      },
      addFavorite(station: StationShortCode) {
        if (!get().isFavorite(station)) {
          set({ favorites: [...get().favorites, station] })
          return true
        }
        return false
      },
      removeFavorite(station: StationShortCode) {
        if (get().isFavorite(station)) {
          set({ favorites: get().favorites.filter(s => s !== station) })
          return true
        }

        return false
      },
    }),
    {
      name: 'favorites-storage',
    },
  ),
)
