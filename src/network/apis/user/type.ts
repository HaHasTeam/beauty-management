import { BaseParams } from '@/types/request'
import { TRoleResponse } from '@/types/role'
import { TUser, UserStatusEnum } from '@/types/user'

export type TCreateUserRequestParams = Pick<TUser, 'username' | 'email' | 'password' | 'phone'> & {
  brands?: string[]
  role: string
} & Partial<Omit<TUser, 'role' | 'brands'>> & {
    redirectUrl?: string
    brands?: string[]
  }

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

export type TUserResponse = Omit<TUser, 'role'> & {
  role?: TRoleResponse
}

export type TUpdateUserStatusRequestParams = {
  id: string
  status: UserStatusEnum
  reason: string
}

export type TUpdateUsersListStatusRequestParams = {
  ids: string[]
  status: UserStatusEnum
  reason: string
}
export type TGetAccountFilterRequestParams = BaseParams<TUser> & {
  brand?: string
  roles?: string
  statuses?: string
  search?: string
}
