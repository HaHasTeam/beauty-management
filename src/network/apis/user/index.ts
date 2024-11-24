import { Routes, routesConfig } from '@/configs/routes'
import { TAuth } from '@/types/auth'
import { TServerResponse } from '@/types/request'
import { TUser } from '@/types/user'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest, publicRequest } from '@/utils/request'

import {
  TCreateUserRequestParams,
  TInviteCoWorkerRequestParams,
  TInviteMultipleCoWorkersRequestParams,
  TLoginUserRequestParams,
  TUpdateUserRequestParams
} from './type'

const inviteCoWorkerRedirectUrl = import.meta.env.VITE_SITE_URL + routesConfig[Routes.AUTH_SIGN_UP].getPath()

export const getUserProfileApi = toQueryFetcher<void, TServerResponse<TUser>>('getUserProfileApi', async () => {
  return privateRequest('/accounts/me')
})

export const createUserApi = toMutationFetcher<TCreateUserRequestParams, TServerResponse<TUser>>(
  'createUserApi',
  async (data) => {
    return publicRequest('/accounts', {
      method: 'POST',
      data
    })
  }
)

export const signInWithPasswordApi = toMutationFetcher<TLoginUserRequestParams, TServerResponse<TAuth>>(
  'signInApi',
  async (data) => {
    return publicRequest('/auth/login', {
      method: 'POST',
      data
    })
  }
)

export const updateProfileApi = toMutationFetcher<TUpdateUserRequestParams, TServerResponse<TUser>>(
  'updateProfileApi',
  async (data) => {
    return privateRequest('/accounts', {
      method: 'PUT',
      data
    })
  }
)

export const inviteCoWorkersApi = toMutationFetcher<TInviteCoWorkerRequestParams, TServerResponse<void>>(
  'inviteMultipleCoWorkersApi',
  async (data) => {
    return privateRequest('/accounts/request-create-account', {
      method: 'POST',
      data: {
        email: data.email,
        role: data.role,
        brand: data.brand,
        url: data.redirectUrl || inviteCoWorkerRedirectUrl
      }
    })
  }
)

export const inviteMultipleCoWorkersApi = toMutationFetcher<
  TInviteMultipleCoWorkersRequestParams,
  TServerResponse<void>[]
>('inviteMultipleCoWorkersApi', async (data) => {
  const { emails, role, brand, redirectUrl } = data
  const requests = emails.map((email) => {
    return inviteCoWorkersApi.raw({ email, role, brand, redirectUrl })
  })
  return Promise.all(requests)
})
