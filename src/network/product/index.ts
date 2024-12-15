import { IResponseProduct, IServerCreateProduct } from '@/types/product'
import { TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

export const getAllProductApi = toQueryFetcher<void, TServerResponse<IResponseProduct[]>>(
  'getAllProductApi',
  async () => {
    return privateRequest('/products')
  }
)
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
