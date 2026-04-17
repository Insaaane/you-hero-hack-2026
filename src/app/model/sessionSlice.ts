import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { UserRole } from '@/entities/user'

type SessionState = {
  currentRole: UserRole
}

const initialState: SessionState = {
  currentRole: 'dispatcher',
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setCurrentRole: (state, action: PayloadAction<UserRole>) => {
      state.currentRole = action.payload
    },
  },
})

export const { setCurrentRole } = sessionSlice.actions
export const sessionReducer = sessionSlice.reducer
