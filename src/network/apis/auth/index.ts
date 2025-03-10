import { TServerError } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest, publicRequest } from '@/utils/request'

export const activateAccountApi = toQueryFetcher<string, TServerError>('activateAccountApi', async (accountId) => {
  return publicRequest(`/accounts/verify-account/${accountId}`, {
    method: 'PUT'
  })
})
export const activateAccountMutateApi = toMutationFetcher<string, TServerError>(
  'activateAccountMutateApi',
  async (accountId) => {
    return privateRequest(`/accounts/verify-account/${accountId}`, {
      method: 'PUT'
    })
  }
)
export const resendMutateApi = toMutationFetcher<{ email: string; url: string }, TServerError>(
  'resendMutateApi',
  async (params) => {
    return publicRequest(`/accounts/resend-verify-email`, {
      method: 'POST',
      data: params
    })
  }
)
