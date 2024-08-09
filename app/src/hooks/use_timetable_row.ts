import { createWithEqualityFn } from 'zustand/traditional'

interface TimetableRowStore {
  timetableRowId: string
  setTimetableRowId: (id: string) => void
}

export const useTimetableRow = createWithEqualityFn<TimetableRowStore>(set => ({
  timetableRowId: '',
  setTimetableRowId: id => set(() => ({ timetableRowId: id })),
}))
