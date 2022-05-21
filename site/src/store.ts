import create from 'zustand'

interface TimetableRowStore {
  timetableRowId: string
  setTimetableRowId: (id: string) => void
}

export const useTimetableRow = create<TimetableRowStore>(set => ({
  timetableRowId: '',
  setTimetableRowId: id => set(() => ({ timetableRowId: id }))
}))
