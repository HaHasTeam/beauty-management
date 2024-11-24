import { create } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { createAuthSlice } from './auth/authSlice'
import { Store } from './store.type'
import { createUserSlice } from './userSlice'

export const useStore = create<Store>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((...a) => ({
          ...createAuthSlice(...a),
          ...createUserSlice(...a)
        }))
      ),
      {
        name: 'auth-store'
      }
    )
  )
)
