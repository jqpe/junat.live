import { configureStore } from '@reduxjs/toolkit'
import { stationPage } from 'src/features/station_page/station_page_slice'

export const store = configureStore({
  reducer: {
    stationPage: stationPage.reducer
  },
  middleware: getDefaultMiddleware => {
    return [...getDefaultMiddleware()]
  },
  devTools: process?.env?.NODE_ENV === 'development'
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
