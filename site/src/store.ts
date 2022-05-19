import create from 'zustand'

interface Store {
  lastStationId: string
  setLastStationId: (id: string) => void
}

export const useStore = create<Store>(set => ({
  lastStationId: '',
  setLastStationId: id => set(() => ({ lastStationId: id }))
}))
