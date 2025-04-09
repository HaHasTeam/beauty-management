import { IServerCreateBlog } from '@/types/blog'
import { BlogEnum } from '@/types/enum'

export type UpdateBlogParams = { id: string; data: IServerCreateBlog }

export type TGetFilteredBlogRequestParams = {
  search?: string
  status?: BlogEnum
}
