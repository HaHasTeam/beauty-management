import { TServerError } from '@/types/request'
import { toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

export const activateAccountApi = toQueryFetcher<string, TServerError>('activateAccountApi', async (accountId) => {
  return privateRequest(`/accounts/verify-account/${accountId}`, {
    method: 'PUT'
  })
})
