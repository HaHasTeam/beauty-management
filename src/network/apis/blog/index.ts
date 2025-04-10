import { IBlogDetails, IServerCreateBlog } from '@/types/blog'
import { TPaginationResponse, TServerResponse } from '@/types/request'
import { toMutationFetcher, toQueryFetcher } from '@/utils/query'
import { privateRequest } from '@/utils/request'

import { TGetFilteredBlogRequestParams, UpdateBlogParams } from './type'

export const getAllBlogApi = toQueryFetcher<void, TServerResponse<IServerCreateBlog[]>>('getAllBlogApi', async () => {
  return privateRequest('/blogs')
})
export const getBlogApi = toQueryFetcher<string, TServerResponse<IBlogDetails>>('getBlogApi', async (productId) => {
  return privateRequest(`/blogs/get-by-id/${productId}`)
})

export const createBlogApi = toMutationFetcher<IServerCreateBlog, TServerResponse<IServerCreateBlog>>(
  'createBlogApi',
  async (data) => {
    return privateRequest('/blogs', {
      method: 'POST',
      data
    })
  }
)

export const getFilteredBlogs = toQueryFetcher<
  TGetFilteredBlogRequestParams,
  TServerResponse<TPaginationResponse<IBlogDetails>>
>('getFilteredBlogs', async (params) => {
  const { page, limit, sortBy, order } = params || {}
  const body: TGetFilteredBlogRequestParams = {}
  return privateRequest('/blogs/filter-blogs', {
    method: 'GET',
    data: body,
    params: { page, limit, sortBy, order }
  })
})

export const updateBlogApi = toMutationFetcher<UpdateBlogParams, TServerResponse<IServerCreateBlog>>(
  'updateBlogApi',
  async ({ id, data }: UpdateBlogParams) => {
    return privateRequest(`/blogs/${id}`, {
      method: 'PUT',
      data
    })
  }
)
