import create from 'zustand/react'

interface Store {
  count: number
  lastStationId: string
}

export const useStore = create<Store>(set => ({
  count: 0,
  lastStationId: '',
  increment: () => set(state => ({ count: state.count + 1 })),
  reset: () => set(() => ({ count: 0 }))
}))
