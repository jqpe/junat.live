import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0,
  scrollY: 0,
  path: ''
}

export const stationPage = createSlice({
  name: 'stationPage',
  initialState,
  reducers: {
    increment(state) {
      state.value++
    },
    setScroll(state, action: PayloadAction<number>) {
      state.scrollY = action.payload
    },
    set(state, action: PayloadAction<{ value: number; path: string }>) {
      state.value = action.payload.value
      state.path = action.payload.path
    }
  }
})

export const { increment, set, setScroll } = stationPage.actions
