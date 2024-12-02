import { AuthSlice } from './auth/auth.type'
import { BranchSlice } from './branch/branch.type'
import { UserSlice } from './userSlice'

export type Store = AuthSlice & UserSlice
export type ManagementClientStore = BranchSlice
