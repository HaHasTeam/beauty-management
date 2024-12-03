import { ICreateProduct, IProduct, IResponseProduct, IServerCreateProduct } from '@/types/product'
import { TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

export const getAllProductApi = toQueryFetcher<void, TServerResponse<IProduct[]>>('getAllProductApi', async () => {
  return privateRequest('/products')
})
export const getProductApi = toQueryFetcher<string, TServerResponse<IResponseProduct[]>>(
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

export const updateProductApi = toMutationFetcher<IServerCreateProduct, TServerResponse<IServerCreateProduct>>(
  'updateProductApi',
  async (productId, data) => {
    return privateRequest(`/products/get-by-id/${productId}`, {
      method: 'PUT',
      data
    })
  }
)
