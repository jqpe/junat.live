import type { ReactNode } from 'react'
import type { StoreApi, UseBoundStore } from 'zustand'

import { createWithEqualityFn } from 'zustand/traditional'

interface Toast {
  title: ReactNode
  /**
   * Duration in milliseconds > 0
   *
   * @default 3000
   */
  duration?: number
  id: string
}

export interface Store {
  /**
   * Clear previous toast and create a new one.
   */
  toast: (toast: string | Omit<Toast, 'id'>) => void
  close: () => void
  readonly _controller?: AbortController
  readonly current?: Toast
}

export const useToast: UseBoundStore<StoreApi<Store>> =
  createWithEqualityFn<Store>((set, get) => ({
    current: undefined,
    _controller: new AbortController(),
    close: () => {
      // Clear timeout on previous instance, if one exists.
      get()._controller?.abort?.()

      set(() => ({ current: undefined, _controller: new AbortController() }))
    },
    toast: toast => {
      get().close()

      const id = crypto.randomUUID()

      set(() => ({
        current:
          typeof toast === 'string' ? { title: toast, id } : { ...toast, id },
      }))

      const duration =
        typeof toast === 'string'
          ? 3000
          : Math.floor(toast.duration || 0) || 3000

      new Promise((resolve, reject) => {
        setTimeout(resolve, duration)
        get()._controller?.signal.addEventListener('abort', reject)
      })
        .then(() => {
          const notClosed = get().current?.id === id

          if (notClosed) {
            get().close()
          }
        })
        .catch(() => void 0)
    },
  }))
