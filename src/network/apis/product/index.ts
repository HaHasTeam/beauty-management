import { IResponseProduct, TProduct } from '@/types/product'
import { TServerResponse } from '@/types/request'
import { toQueryFetcher } from '@/utils/query'
import { privateRequest, publicRequest } from '@/utils/request'

import { TGetProductByBrandIdRequestParams, TGetProductFilterRequestParams } from './type'

export const getProductByBrandIdApi = toQueryFetcher<TGetProductByBrandIdRequestParams, TServerResponse<TProduct[]>>(
  'getProductByBrandIdApi',
  async (params) => {
    return privateRequest(`/products/get-by-brand/${params?.brandId}`)
  }
)
export const getProductFilterApi = toQueryFetcher<
  TGetProductFilterRequestParams,
  TServerResponse<{ total: string }, IResponseProduct[]>
>('getProductFilterApi', async (params) => {
  return publicRequest(`/products/filter-product`, {
    method: 'GET',
    params: params
  })
})
