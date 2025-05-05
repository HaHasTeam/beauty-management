import { ILivestream } from '@/types/live-stream'
import { TServerResponseWithPagination } from '@/types/request'
import { toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import { TFilterLivestreamsParams } from './type'

export const filterLivestreamsApi = toQueryFetcher<
  TFilterLivestreamsParams,
  TServerResponseWithPagination<ILivestream[]>
>('filterLivestreams', async (params) => {
  const { page, limit, sortBy, order, ...rest } = params || {}

  const cleanedData = Object.fromEntries(
    Object.entries(rest).filter(([, value]) => {
      if (value === '') return false
      if (value === undefined) return false
      if (value === null) return false
      return true
    })
  )

  return privateRequest('/livestreams/filter', {
    method: 'POST',
    data: cleanedData,
    params: {
      page,
      limit,
      sortBy,
      order
    }
  })
})
