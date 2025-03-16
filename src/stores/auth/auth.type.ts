import { TAuth } from '@/types/auth'
import { TUser } from '@/types/user'

export type AuthState = {
  isLoading: boolean
  isAuthenticated: boolean
  user?: TUser
  authData?: TAuth
}

export type AuthActions = {
  setAuthState: (params: Partial<AuthState>) => void
  resetAuth: () => void
}

export type AuthSlice = AuthState & AuthActions
