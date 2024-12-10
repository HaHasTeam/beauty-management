import { TFlashSale } from '@/types/flash-sale'
import { TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import { TAddFlashSaleRequestParams, TGetAllFlashSaleByBrandIdRequestParams } from './type'

export const addFlashSaleApi = toMutationFetcher<TAddFlashSaleRequestParams, TServerResponse<TFlashSale>>(
  'addFlashSaleApi',
  async (params) => {
    return privateRequest('/product-discount', {
      method: 'POST',
      data: params
    })
  }
)

export const getAllFlashSaleListByBrandIdApi = toQueryFetcher<
  TGetAllFlashSaleByBrandIdRequestParams,
  TServerResponse<TFlashSale[]>
>('getAllFlashSaleListByBrandIdApi', async (params) => {
  return privateRequest(`/product-discount/get-product-discount-of-brand/${params?.brandId}`, {
    method: 'GET',
    params
  })
})

export const getAllFlashSaleApi = toQueryFetcher<void, TServerResponse<TFlashSale[]>>(
  'getAllFlashSaleApi',
  async () => {
    return privateRequest('/product-discount', {
      method: 'GET'
    })
  }
)
