import { createWithEqualityFn } from 'zustand/traditional'
import { persist, createJSONStorage } from 'zustand/middleware'

interface FiltersStore {
  destination: Record<string, string | null>
  actions: {
    setDestination: (station: string, destination: string) => void
  }
}

const usePersistedFiltersStore = createWithEqualityFn<FiltersStore>()(
  persist(
    (set, get) => ({
      destination: {},
      actions: {
        setDestination(station, destination) {
          const valueOrNull = destination === '' ? null : destination ?? null

          set(store => ({
            ...store,
            destination: Object.assign(get().destination, {
              [station]: valueOrNull
            })
          }))
        }
      }
    }),
    {
      storage: createJSONStorage(() => sessionStorage),
      name: 'filters',
      partialize: state => {
        type T = Partial<FiltersStore> & Omit<FiltersStore, 'actions'>

        const stateWithoutActions: T = {
          ...state
        }

        delete stateWithoutActions.actions

        return stateWithoutActions
      }
    }
  )
)

/**
 * Hook to interface with filters specific for a station. Use `useStationPage` hook to get the curretly active station.
 * Filters are persisted with [session storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage).
 *
 * @param station May be `undefined` to disable the hook, e.g. if the current station is not yet known.
 */
export const useStationFilters = (station: string | undefined) => {
  const [destination, setStoreDestination] = usePersistedFiltersStore(state => [
    state.destination,
    state.actions.setDestination
  ])

  const setDestination = (destination: string) => {
    if (station) {
      setStoreDestination(station, destination)
    }
  }

  if (!station) {
    return {
      destination: null,
      setDestination
    }
  }

  return {
    destination: destination[station] ?? null,
    setDestination
  }
}
