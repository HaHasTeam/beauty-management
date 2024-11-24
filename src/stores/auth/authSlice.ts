import { StateCreator } from 'zustand'

import { AuthSlice, AuthState } from './auth.type'

const initialState: AuthState = {
  isLoading: false,
  isAuthenticated: false
} as AuthState

export const createAuthSlice: StateCreator<AuthSlice, [['zustand/immer', never]], [], AuthSlice> = (set) => ({
  ...initialState,
  setAuthState: ({ user, authData, isAuthenticated, isLoading }) =>
    set((state) => {
      state.isLoading = isLoading ?? state.isLoading
      state.isAuthenticated = isAuthenticated ?? state.isAuthenticated
      state.user = user ?? state.user
      state.authData = authData ?? state.authData
    }),
  resetAuth: () => set(initialState)
})
