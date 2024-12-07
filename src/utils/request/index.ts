import { AxiosRequestConfig } from 'axios'
import mem from 'mem'

import { axiosRequest } from '@/network/axios'

import { getAuthData } from '../auth'

const GET_SESSION_CACHE_TIME = 1_000

const getAccessToken = mem(
  async (keepPrevious = true) => {
    const authData = await getAuthData({ keepPrevious })
    return authData.accessToken
  },
  {
    maxAge: GET_SESSION_CACHE_TIME
  }
)

export const privateRequest = async <R>(url: string, options?: AxiosRequestConfig): Promise<R> => {
  const accessToken = await getAccessToken()
  return axiosRequest({
    ...options,
    url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...options?.headers
    }
  })
}

export const publicRequest = async <R>(url: string, options?: AxiosRequestConfig): Promise<R> => {
  return axiosRequest({
    url,
    ...options,
    headers: {
      ...options?.headers
    }
  })
}
