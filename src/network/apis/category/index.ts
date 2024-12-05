import { ICategory } from '@/types/category'
import { TServerResponse } from '@/types/request'
import { toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

export const getCategoryApi = toQueryFetcher<void, TServerResponse<ICategory[]>>('getCategoryApi', async () => {
  return privateRequest('/category/')
})
