import { IProduct, IResponseProduct, TProduct } from '@/types/product'
import { TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest, publicRequest } from '@/utils/request'

import { TGetProductByBrandIdRequestParams, TGetProductFilterRequestParams } from './type'

export const getProductByBrandIdApi = toQueryFetcher<TGetProductByBrandIdRequestParams, TServerResponse<TProduct[]>>(
  'getProductByBrandIdApi',
  async (params) => {
    return privateRequest(`/products/get-by-brand/${params?.brandId}`)
  }
)

export const getProductByIdApi = toQueryFetcher<string, TServerResponse<TProduct>>(
  'getProductByIdApi',
  async (params) => {
    return privateRequest(`/products/get-by-id/${params}`)
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

export const updateProductStatusApi = toMutationFetcher<{ id: string; status: string }, TServerResponse<IProduct>>(
  'updateProductStatusApi',
  async ({ id, status }) => {
    return privateRequest(`/orders/update-status/${id}`, {
      method: 'PUT',
      data: { status: status }
    })
  }
)
