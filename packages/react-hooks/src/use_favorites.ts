import { persist } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

interface FavoritesStore {
  favorites: string[]
  homePageDefaultList: boolean
  setHomePageDefaultList: (value: boolean) => void
  isFavorite: (station: string) => boolean
  addFavorite: (station: string) => boolean
  removeFavorite: (station: string) => boolean
}

/**
 * Hook to interface with favorite stations stored in local storage. Station shortcodes are stored.
 */
export const useFavorites = createWithEqualityFn<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: <string[]>[],
      setHomePageDefaultList: value => set({ homePageDefaultList: value }),
      homePageDefaultList: false,
      isFavorite(station: string) {
        return get().favorites.includes(station)
      },
      addFavorite(station: string) {
        if (!get().isFavorite(station)) {
          set({ favorites: [...get().favorites, station] })
          return true
        }
        return false
      },
      removeFavorite(station: string) {
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
