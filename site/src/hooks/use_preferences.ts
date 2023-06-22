import type { StoreApi, UseBoundStore } from 'zustand'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Preferences {
  wakeLock: boolean
  theme: 'dark' | 'light' | 'auto'
}

export interface PreferencesStore {
  setPreferences: (preferences: Partial<Preferences>) => unknown
  theme: Preferences['theme']
  wakeLock: Preferences['wakeLock']
}

/**
 * Hook for storing data for multiple stations.
 */
export const usePreferences: UseBoundStore<StoreApi<PreferencesStore>> = create(
  persist<PreferencesStore>(
    (set, get) => ({
      wakeLock: true,
      theme: 'auto',
      setPreferences(preferences) {
        return set(() => ({
          theme: preferences.theme ?? get().theme,
          wakeLock: preferences.wakeLock ?? get().wakeLock
        }))
      }
    }),
    { name: 'preferences' }
  )
)
