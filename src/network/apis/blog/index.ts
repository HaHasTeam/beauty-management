import { IBlogDetails, IServerCreateBlog } from '@/types/blog'
import { TServerResponse } from '@/types/request'
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
export const getFilteredBlogs = toQueryFetcher<TGetFilteredBlogRequestParams, TServerResponse<IBlogDetails[]>>(
  'getFilteredBlogs',
  async (query) => {
    return privateRequest('/blogs/filter-blogs', {
      method: 'GET',
      params: query
    })
  }
)

export const updateBlogApi = toMutationFetcher<UpdateBlogParams, TServerResponse<IServerCreateBlog>>(
  'updateBlogApi',
  async ({ id, data }: UpdateBlogParams) => {
    return privateRequest(`/blogs/${id}`, {
      method: 'PUT',
      data
    })
  }
)
