import { ICategory } from '@/types/category'
import { TServerResponse, TServerResponseWithPaging } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import {
  AddCategoryRequestParams,
  GetCategoryByIdRequestParams,
  GetCategoryFilterRequestParams,
  UpdateCategoryByIdRequestParams
} from './type'

export const getAllCategoryApi = toQueryFetcher<void, TServerResponse<ICategory[]>>('getAllCategoryApi', async () => {
  return privateRequest('/category')
})

export const addCategoryApi = toMutationFetcher<AddCategoryRequestParams, TServerResponse<ICategory>>(
  'addCategoryApi',
  async (data) => {
    return privateRequest('/category', {
      method: 'POST',
      data
    })
  }
)

export const getCategoryByIdApi = toQueryFetcher<GetCategoryByIdRequestParams, TServerResponse<ICategory[]>>(
  'getCategoryByIdApi',
  async (params) => {
    const result = (await privateRequest(`/category/get-by-id/${params?.categoryId}`)) as TServerResponse<ICategory[]>
    const flatData: ICategory[] = ((await flattenCategoryApi.raw()) as TServerResponse<ICategory[]>).data
    const data = result.data as ICategory[]
    const item = data[0]
    const parsedItem = {
      ...item,
      parentCategory: flatData.find((category) => {
        return category.subCategories?.some((sub) => {
          return sub.id === item.id
        })
      })
    }
    return { data: [parsedItem], message: 'success' }
  }
)

export const updateCategoryByIdApi = toMutationFetcher<UpdateCategoryByIdRequestParams, TServerResponse<ICategory>>(
  'updateCategoryByIdApi',
  async (data) => {
    return privateRequest(`/category/${data.id}`, {
      method: 'PUT',
      data
    })
  }
)

export const flattenCategoryApi = toQueryFetcher<void, TServerResponse<ICategory[]>>('flattenCategoryApi', async () => {
  const parents = (await getAllCategoryApi.raw()).data as ICategory[]
  const flatData: ICategory[] = []
  const intervalPush = (parent: ICategory) => {
    flatData.push(parent)
    const subs = parent.subCategories ?? []
    for (const child of subs) {
      intervalPush(child)
    }
  }

  for (const parent of parents) {
    intervalPush(parent)
  }

  return { data: flatData, message: 'success' }
})

export const getCategoryFilterApi = toQueryFetcher<
  GetCategoryFilterRequestParams,
  TServerResponseWithPaging<ICategory[]>
>('getCategoryFilterApi', async (params) => {
  return privateRequest(`/category/filter-category`, {
    method: 'GET',
    params: params
  })
})
