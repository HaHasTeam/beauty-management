import { BlogEnum } from './enum'

export interface IServerCreateBlog {
  title: string
  content: string
  status: BlogEnum
  authorId?: string
}
export interface IBlogDetails {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  content: string
  status: BlogEnum
}
