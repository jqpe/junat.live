import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  count: 0,
  lastStationId: ''
}

export const stationPage = createSlice({
  name: 'stationPage',
  initialState,
  reducers: {
    increment(state) {
      state.count++
    },
    setLastStationId(state, action: PayloadAction<string>) {
      state.lastStationId = action.payload
    }
  }
})

export const { increment, setLastStationId } = stationPage.actions
