import { IBranch, IBranch2 } from '@/types/Branch'
import { TBrand } from '@/types/brand'
import { TPaginationResponse, TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest, publicRequest } from '@/utils/request'

import {
  RequestAssignOperatorParams,
  TFilterBrandRequestParams,
  TRequestCreateBrandParams,
  TUpdateBrandRequestParams,
  TUpdateStatusBrandRequestParams
} from './type'

export const requestCreateBrandApi = toMutationFetcher<TRequestCreateBrandParams, TServerResponse<IBranch>>(
  'requestCreateBrand',
  async (params) => {
    return privateRequest('/brands/create', {
      method: 'POST',
      data: params
    })
  }
)

export const assignOperateToBrandApi = toMutationFetcher<RequestAssignOperatorParams, TServerResponse<IBranch>>(
  'assignOperateToBrandApi',
  async (params) => {
    return privateRequest(`/brands/assign-interview/${params.brandId}`, {
      method: 'POST',
      data: {
        reviewerId: params.operatorId
      }
    })
  }
)
export const updateStatusBrandByIdApi = toMutationFetcher<TUpdateStatusBrandRequestParams, TServerResponse<IBranch>>(
  'updateStatusBrandById',
  async (params) => {
    return privateRequest(`/brands/update-status/`, {
      method: 'PUT',
      data: {
        reason: params.reason || 'Update success',
        brandId: params?.brandId,
        status: params.status,
        url: params.url
      }
    })
  }
)

export const updateBrandByIdApi = toMutationFetcher<TUpdateBrandRequestParams, TServerResponse<IBranch>>(
  'updateBrandById',
  async (params) => {
    return privateRequest(`/brands/update-detail/${params?.brandId}`, {
      method: 'PUT',
      data: params
    })
  }
)
export const getBrandByIdApi = toQueryFetcher<string, TServerResponse<IBranch2>>('getBrandById', async (brandId) => {
  return publicRequest(`/brands/get-by-id/${brandId}`, {
    method: 'GET'
  })
})
export const getAllBrandsApi = toQueryFetcher<void, TServerResponse<TBrand[]>>('getAllBrands', async () => {
  return publicRequest(`/brands/`, {
    method: 'GET'
  })
})

export const filterBrandsApi = toQueryFetcher<TFilterBrandRequestParams, TServerResponse<TPaginationResponse<TBrand>>>(
  'filterBrands',
  async (params) => {
    const { page, limit, sortBy, order, ...filterParams } = params || {}
    const body: TFilterBrandRequestParams = {}
    if (filterParams?.name) {
      body.name = filterParams.name
    }
    if (filterParams?.reviewerId) {
      body.reviewerId = filterParams.reviewerId
    }
    if (filterParams?.statuses?.length) {
      body.statuses = filterParams.statuses
    }

    return privateRequest('/brands/filter', {
      method: 'POST',
      data: body,
      params: { page, limit, sortBy, order }
    })
  }
)
