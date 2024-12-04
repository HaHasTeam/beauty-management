import { IBranch } from '@/types/Branch'
import { TBrand } from '@/types/brand'
import { TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest, publicRequest } from '@/utils/request'

import { TGetBrandByIdRequestParams, TRequestCreateBrandParams, TUpdateStatusBrandRequestParams } from './type'

export const requestCreateBrandApi = toMutationFetcher<TRequestCreateBrandParams, TServerResponse<IBranch>>(
  'requestCreateBrand',
  async (params) => {
    return privateRequest('/brands/create', {
      method: 'POST',
      data: params
    })
  }
)
export const updateStatusBrandByIdApi = toMutationFetcher<TUpdateStatusBrandRequestParams, TServerResponse<IBranch>>(
  'updateStatusBrandById',
  async (params) => {
    return publicRequest(`/brands/update-status/${params?.brandId}`, {
      method: 'PUT',
      data: params
    })
  }
)
export const getBrandByIdApi = toQueryFetcher<TGetBrandByIdRequestParams, TServerResponse<IBranch>>(
  'getBrandById',
  async (params) => {
    return publicRequest(`/brands/get-by-id/${params?.brandId}`, {
      method: 'GET',
      params
    })
  }
)
export const getAllBrandsApi = toQueryFetcher<void, TServerResponse<TBrand[]>>('getAllBrands', async () => {
  return publicRequest(`/brands/`, {
    method: 'GET'
  })
})
