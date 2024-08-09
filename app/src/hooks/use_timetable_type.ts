import { createWithEqualityFn } from 'zustand/traditional'

interface TimetableTypeStore {
  /**
   * @default "DEPARTURE"
   */
  type: 'ARRIVAL' | 'DEPARTURE'
  actions: {
    setType: (type: 'ARRIVAL' | 'DEPARTURE') => void
  }
}

/**
 * Change the preferred timetable type.
 */
export const useTimetableType = createWithEqualityFn<TimetableTypeStore>(
  set => ({
    type: 'DEPARTURE',
    actions: {
      setType(type) {
        set(store => ({ ...store, type }))
      },
    },
  }),
)
