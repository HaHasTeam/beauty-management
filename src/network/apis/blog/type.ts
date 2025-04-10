import { IBlogDetails, IServerCreateBlog } from '@/types/blog'
import { BaseParams } from '@/types/request'

export type UpdateBlogParams = { id: string; data: IServerCreateBlog }

export type TGetFilteredBlogRequestParams = BaseParams<IBlogDetails>
