import type { PersistStorage, StorageValue } from 'zustand/middleware'

import { Store } from '@tauri-apps/plugin-store'

export const store = new Store('store.bin')

/** Store values with Tauri store, seamlessly integrates with Zustand via `storage` property */
export const zustandTauriAdapter = <T>(): PersistStorage<T> => ({
  getItem(name) {
    return store.get<StorageValue<T>>(name)
  },

  setItem(name, value) {
    return store.set(name, value)
  },

  removeItem(name) {
    return store.delete(name)
  },
})
