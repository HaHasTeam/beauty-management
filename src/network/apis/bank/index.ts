import axios from 'axios'

import { TBankResponse } from '@/types/bank'
import { toQueryFetcher } from '@/utils/query'

/**
 * Fetches the list of banks from the VietQR API
 */
export const getBanksApi = toQueryFetcher<void, TBankResponse>('get-banks', async () => {
  const response = await axios.get('https://api.vietqr.io/v2/banks')
  return response.data
})
