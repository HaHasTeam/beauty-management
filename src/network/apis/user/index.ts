import { Routes, routesConfig } from '@/configs/routes'
import { TAuth } from '@/types/auth'
import { TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest, publicRequest } from '@/utils/request'

import {
  TCreateUserRequestParams,
  TGetAccountFilterRequestParams,
  TInviteCoWorkerRequestParams,
  TInviteMultipleCoWorkersRequestParams,
  TLoginUserRequestParams,
  TUpdateUserRequestParams,
  TUpdateUsersListStatusRequestParams,
  TUpdateUserStatusRequestParams,
  TUserResponse
} from './type'

const inviteCoWorkerRedirectUrl = import.meta.env.VITE_SITE_URL + routesConfig[Routes.AUTH_SIGN_UP].getPath()
const verifyEmailRedirectUrl = import.meta.env.VITE_SITE_URL + routesConfig[Routes.AUTH_EMAIL_VERIFICATION].getPath()
export const getUserProfileApi = toQueryFetcher<void, TServerResponse<TUserResponse>>('getUserProfileApi', async () => {
  return privateRequest('/accounts/me')
})

export const createUserApi = toMutationFetcher<TCreateUserRequestParams, TServerResponse<TUserResponse>>(
  'createUserApi',
  async (data) => {
    return publicRequest('/accounts', {
      method: 'POST',
      data: {
        ...data,
        url: data.redirectUrl || verifyEmailRedirectUrl
      }
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

export const updateProfileApi = toMutationFetcher<TUpdateUserRequestParams, TServerResponse<TUserResponse>>(
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

export const getAllUserApi = toQueryFetcher<void, TServerResponse<TUserResponse[]>>('getAllUserApi', async () => {
  return privateRequest('/accounts')
})

export const updateUserStatusApi = toMutationFetcher<TUpdateUserStatusRequestParams, TServerResponse<void>>(
  'updateUserStatusApi',
  async (data) => {
    return privateRequest(`/accounts/update-account-status`, {
      method: 'POST',
      data: {
        accountId: data.id,
        reason: data.reason,
        status: data.status
      }
    })
  }
)

export const updateUsersListStatusApi = toMutationFetcher<TUpdateUsersListStatusRequestParams, TServerResponse<void>[]>(
  'updateUsersListStatusApi',
  async (data) => {
    const { ids, status, reason } = data
    const requests = ids.map((id) => {
      return updateUserStatusApi.raw({ id, status, reason })
    })
    return Promise.all(requests)
  }
)

export const getAccountFilterApi = toQueryFetcher<
  TGetAccountFilterRequestParams,
  TServerResponse<{ total: string; limit: string; pages: string; items: TUserResponse[] }>
>('getProductFilterApi', async (params) => {
  return privateRequest(`/accounts/filter-account`, {
    method: 'GET',
    params: params
  })
})
