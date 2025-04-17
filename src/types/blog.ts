import { BlogEnum } from './enum'
import { TUser } from './user'

export interface IServerCreateBlog {
  title: string
  content: string
  status: BlogEnum
  authorId?: string
  tag: string
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
}
