import { TGroupBuying } from '@/types/group-buying'
import { BaseParams, TServerResponseWithPagination } from '@/types/request'
import { toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

export type TFilterGroupBuyingsRequest = BaseParams<{
  groupProductId?: string
  statuses?: string[]
}>

export const filterGroupBuyingsApi = toQueryFetcher<
  TFilterGroupBuyingsRequest,
  TServerResponseWithPagination<TGroupBuying[]>
>('filterGroupBuyingsApi', async (params) => {
  const { page, limit, sortBy, order, ...rest } = params || {}

  const cleanedData = Object.fromEntries(
    Object.entries(rest).filter(([, value]) => {
      if (value === '') return false
      if (value === undefined) return false
      if (value === null) return false
      if (Array.isArray(value) && value.length === 0) return false
      return true
    })
  )

  return privateRequest('/group-buyings/filter', {
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
