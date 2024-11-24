import { AuthSlice } from './auth/auth.type'
import { UserSlice } from './userSlice'

export type Store = AuthSlice & UserSlice
