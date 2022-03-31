import { configureStore } from '@reduxjs/toolkit'
import { digitrafficApi } from 'src/features/digitraffic/digitraffic_slice'
import { stationPage } from 'src/features/station_page/station_page_slice'

export const store = configureStore({
  reducer: {
    stationPage: stationPage.reducer,
    [digitrafficApi.reducerPath]: digitrafficApi.reducer
  },
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware().concat(digitrafficApi.middleware)
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
