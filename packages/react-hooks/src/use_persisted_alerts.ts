import { createJSONStorage, persist } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

interface FiltersStore {
  alerts: string[]
  actions: {
    hideAlert: (alertId: string) => void
  }
}

export const usePeristedAlerts = createWithEqualityFn<FiltersStore>()(
  persist(
    (set, get) => ({
      alerts: [],
      actions: {
        hideAlert(alertId) {
          set(store => ({
            ...store,
            alerts: [...get().alerts, alertId],
          }))
        },
      },
    }),
    {
      storage: createJSONStorage(() => localStorage),
      name: 'hidden-alerts',
      partialize: state => {
        type T = Partial<FiltersStore> & Omit<FiltersStore, 'actions'>

        const stateWithoutActions: T = {
          ...state,
        }

        delete stateWithoutActions.actions

        return stateWithoutActions
      },
    },
  ),
)
