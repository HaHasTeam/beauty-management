import { jwtDecode, JwtPayload } from 'jwt-decode'

import { INVALID_ACCESS_TOKEN, REFRESH_TOKEN_EXPIRED, UNAUTHENTICATED } from '@/constants/error'
import { axiosRequest } from '@/network/axios'
import { useStore } from '@/stores/store'
import { TServerResponse } from '@/types/request'

type TGetAuthDataParams = {
  keepPrevious: boolean
}

const bufferTime = 1000 * 60 * 5
export const getAuthData = async (params?: TGetAuthDataParams) => {
  const { authData } = useStore.getState()
  if (!authData) throw new Error(UNAUTHENTICATED)
  const decodedToken = jwtDecode<JwtPayload>(authData.accessToken)

  //   If keepPrevious is true, return the authData
  if (params?.keepPrevious) return authData

  if (!decodedToken.exp) throw new Error(INVALID_ACCESS_TOKEN)
  // If over 5 minutes from expiration, throw an error
  const isExpired = Date.now() >= decodedToken.exp * 1000 - bufferTime

  if (isExpired) {
    try {
      // Call refresh token endpoint
      const response = await axiosRequest<TServerResponse<{ accessToken: string; refreshToken: string }>>({
        url: '/auth/refresh-token',
        method: 'post',
        data: {
          refreshToken: authData.refreshToken
        }
      })

      // Extract new tokens from response
      const { accessToken, refreshToken } = response.data

      // Update auth state with new tokens
      const updatedAuthData = {
        ...authData,
        accessToken,
        refreshToken
      }

      useStore.getState().setAuthState({
        isAuthenticated: true,
        isLoading: false,
        authData: updatedAuthData
      })

      return updatedAuthData
    } catch (error) {
      // Check if refresh token is expired
      const refreshDecodedToken = jwtDecode<JwtPayload>(authData.refreshToken)
      const isRefreshExpired = refreshDecodedToken.exp && Date.now() >= refreshDecodedToken.exp * 1000

      if (isRefreshExpired) {
        throw new Error(REFRESH_TOKEN_EXPIRED)
      }

      // If there's another issue with refresh, throw the original error
      throw error
    }
  }

  return authData
}
