import { Routes, routesConfig } from '@/configs/routes'
import { TAuth } from '@/types/auth'
import { TServerResponse, TServerResponseWithPaging } from '@/types/request'
import { TUser } from '@/types/user'
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

export const getAccountFilterApi = toQueryFetcher<TGetAccountFilterRequestParams, TServerResponseWithPaging<TUser[]>>(
  'getAccountFilterApi',
  async (params) => {
    const res = (await privateRequest(`/accounts/filter-account`, {
      method: 'GET',
      params: params
    })) as TServerResponseWithPaging<TUserResponse[]>
    const { data: userData } = res

    const parsedData = userData.items.map<TUser>((user) => {
      return {
        ...user,
        role: user.role?.role
      } as TUser
    })

    const result = {
      message: res.message,
      data: {
        ...res.data,
        items: parsedData
      }
    } as TServerResponseWithPaging<TUser[]>
    return result
  }
)

// New API function to get user statistics for charts
export const getUserStatsApi = toQueryFetcher<void, TServerResponse<TUserResponse[]>>('getUserStatsApi', async () => {
  // First, fetch all users
  const response = (await privateRequest('/accounts')) as TServerResponse<TUserResponse[]>

  // Return the response directly
  // We'll process this data in the component to create chart data
  return response
})
