import { configureStore } from '@reduxjs/toolkit'
import { digitrafficApi } from 'src/features/digitraffic/digitraffic_slice'
import { stationsApi } from 'src/features/stations/stations_slice'
import { stationPage } from 'src/features/station_page/station_page_slice'

export const store = configureStore({
  reducer: {
    [stationsApi.reducerPath]: stationsApi.reducer,
    stationPage: stationPage.reducer,
    [digitrafficApi.reducerPath]: digitrafficApi.reducer
  },
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware()
      .concat(digitrafficApi.middleware)
      .concat(stationsApi.middleware)
  },
  devTools: process?.env?.NODE_ENV === 'development'
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
