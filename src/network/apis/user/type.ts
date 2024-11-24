import { TUser } from '@/types/user'

export type TCreateUserRequestParams = Pick<TUser, 'username' | 'email' | 'password' | 'brand'> & {
  role: string
} & Partial<Omit<TUser, 'role'>>

export type TLoginUserRequestParams = Pick<TUser, 'email' | 'password'>

export type TUpdateUserRequestParams = Partial<Omit<TUser, 'email' | 'password'>>

export type TInviteCoWorkerRequestParams = Pick<TUser, 'email'> & {
  role: string
  brand?: string
  redirectUrl?: string
}

export type TInviteMultipleCoWorkersRequestParams = {
  emails: string[]
  role: string
  brand?: string
  redirectUrl?: string
}
