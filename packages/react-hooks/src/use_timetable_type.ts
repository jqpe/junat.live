import { createWithEqualityFn } from 'zustand/traditional'

import { TimeTableRowType } from '@junat/graphql/digitraffic'

interface TimetableTypeStore {
  /**
   * @default "DEPARTURE"
   */
  type: TimeTableRowType
  actions: {
    setType: (type: TimeTableRowType) => void
  }
}

/**
 * Change the preferred timetable type.
 */
export const useTimetableType = createWithEqualityFn<TimetableTypeStore>(
  set => ({
    type: TimeTableRowType.Departure,
    actions: {
      setType(type) {
        set(store => ({ ...store, type }))
      },
    },
  }),
)
