import { createContext } from 'react'

import { TUser } from '@/types/user'

interface OpenContextType {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
type UserDetails = { [x: string]: unknown } | null

export const OpenContext = createContext<OpenContextType>({} as OpenContextType)
export const UserContext = createContext<TUser | undefined | null>(undefined)
export const UserDetailsContext = createContext<UserDetails | undefined | null>(undefined)
