import { configureStore } from '@reduxjs/toolkit'
import { digitrafficApi } from 'src/features/digitraffic/digitraffic_slice'

export const store = configureStore({
  reducer: {
    [digitrafficApi.reducerPath]: digitrafficApi.reducer
  },
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware().concat(digitrafficApi.middleware)
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
