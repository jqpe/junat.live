import create from 'zustand'

interface Store {
  count: number
  lastStationId: string
  setLastStationId: (id: string) => void
  increment: VoidFunction
  reset: VoidFunction
}

export const useStore = create<Store>(set => ({
  count: 0,
  lastStationId: '',
  setLastStationId: id => set(() => ({ lastStationId: id })),
  increment: () => set(state => ({ count: state.count + 1 })),
  reset: () => set(() => ({ count: 0 }))
}))
