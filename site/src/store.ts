import create from 'zustand'

interface Store {
  timetableRowId: string
  setTimetableRowId: (id: string) => void
}

export const useStation = create<Store>(set => ({
  timetableRowId: '',
  setTimetableRowId: id => set(() => ({ timetableRowId: id }))
}))
