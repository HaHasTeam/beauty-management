import { TProduct } from '@/types/product'
import { TServerResponse } from '@/types/request'
import { toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import { TGetProductByBrandIdRequestParams } from './type'

export const getProductByBrandIdApi = toQueryFetcher<TGetProductByBrandIdRequestParams, TServerResponse<TProduct[]>>(
  'getProductByBrandIdApi',
  async (params) => {
    return privateRequest(`/products/get-by-brand/${params?.brandId}`)
  }
)
