import { configureStore } from '@reduxjs/toolkit'
import { sessionReducer } from '@/app/model/sessionSlice'
import { baseApi } from '@/shared/api/baseApi'

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
  devTools: import.meta.env.DEV,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
