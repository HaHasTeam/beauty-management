import { BlogEnum, BlogTypeEnum } from './enum'
import { TUser } from './user'

export interface IServerCreateBlog {
  title: string
  content: string
  status: BlogEnum
  authorId?: string
  tag: string
  type: BlogTypeEnum
}
export interface IBlogDetails {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  content: string
  tag: string
  status: BlogEnum
  author: TUser
  type: BlogTypeEnum
}
