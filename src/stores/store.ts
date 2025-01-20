import { create } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { createAuthSlice } from './auth/authSlice'
import { createBranchSlice } from './branch/branchSlice'
import { ManagementClientStore, Store } from './store.type'

export const useStore = create<Store>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((...a) => ({
          ...createAuthSlice(...a)
        }))
      ),
      {
        name: 'auth-store'
      }
    )
  )
)

export const useClientStore = create<ManagementClientStore>()(
  subscribeWithSelector(
    immer((...a) => ({
      ...createBranchSlice(...a)
    }))
  )
)
