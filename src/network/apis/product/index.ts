import _ from 'lodash'

import { IProduct, IResponseProduct, IServerCreateProduct, TProduct } from '@/types/product'
import { BaseParams, TServerResponse, TServerResponseWithPaging } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest, publicRequest } from '@/utils/request'

import { TGetProductByBrandIdRequestParams, TGetProductFilterRequestParams } from './type'

export const getAllProductApi = toQueryFetcher<void, TServerResponse<TProduct[]>>('getAllProductApi', async () => {
  return privateRequest('/products')
})
export const getProductApi = toQueryFetcher<string, TServerResponse<IResponseProduct>>(
  'getProductApi',
  async (productId) => {
    return privateRequest(`/products/get-by-id/${productId}`)
  }
)

export const createProductApi = toMutationFetcher<IServerCreateProduct, TServerResponse<IServerCreateProduct>>(
  'createProductApi',
  async (data) => {
    return privateRequest('/products', {
      method: 'POST',
      data
    })
  }
)

type UpdateProductParams = { productId: string; data: IServerCreateProduct }

export const updateProductApi = toMutationFetcher<UpdateProductParams, TServerResponse<IServerCreateProduct>>(
  'updateProductApi',
  async ({ productId, data }: UpdateProductParams) => {
    return privateRequest(`/products/${productId}`, {
      method: 'PUT',
      data
    })
  }
)

export const getProductFilterMutationApi = toMutationFetcher<
  TGetProductFilterRequestParams,
  TServerResponse<{ total: string }, IResponseProduct[]>
>('getRecommendProducts', async (params) => {
  return publicRequest('/products/filter-product', {
    method: 'GET',
    params
  })
})
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
  const cleanParams = _.omitBy(params, (value) => !value || (Array.isArray(value) && value.length === 0))
  return publicRequest(`/products/filter-product`, {
    method: 'GET',
    params: cleanParams
  })
})

export const updateProductStatusApi = toMutationFetcher<{ id: string; status: string }, TServerResponse<IProduct>>(
  'updateProductStatusApi',
  async ({ id, status }) => {
    return privateRequest(`/products/update-status/${id}`, {
      method: 'PUT',
      data: { status: status }
    })
  }
)

export const filterProductApi = toQueryFetcher<
  TGetProductFilterRequestParams,
  TServerResponseWithPaging<IResponseProduct[]>
>('filterProductApi', async (params) => {
  return publicRequest(`/products/filter-product`, {
    method: 'GET',
    params
  })
})

// Define parameters for consultant suggested products
type TGetConsultantSuggestedProductsParams = BaseParams<{
  consultantId: string
  brandId: string
}>

// API to get products suggested by a consultant for a specific brand
export const getConsultantSuggestedProductsApi = toQueryFetcher<
  TGetConsultantSuggestedProductsParams,
  TServerResponseWithPaging<IResponseProduct[]> // Assuming paginated product response
>('getConsultantSuggestedProductsApi', async (params) => {
  // Ensure required params are present if necessary, or handle defaults
  if (!params?.consultantId || !params?.brandId) {
    throw new Error('Consultant ID and Brand ID are required')
  }
  return privateRequest('/accounts/consultant-suggested-products', {
    method: 'GET',
    params: params
  })
})
