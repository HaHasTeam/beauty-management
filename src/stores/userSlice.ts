import { StateCreator } from 'zustand'

import { TUser } from '@/types/user'

type UserState = {
  data: TUser
}
const initialState: UserState = {} as UserState

type UserActions = {
  setUser: (user: TUser) => void
}

export type UserSlice = UserState & UserActions

export const createUserSlice: StateCreator<UserSlice, [['zustand/immer', never]], [], UserSlice> = (set) => ({
  ...initialState,
  setUser: (user: TUser) =>
    set((state) => {
      state.data = user
      return {
        ...state
      }
    })
})
