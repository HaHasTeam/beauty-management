import { TServerFile } from './file'
import { TMetaData } from './request'
import { TUser } from './user'

export type ISubmitFeedbackScheme = {
  rating: number
  content: string
  orderDetailId: string
  mediaFiles: string[]
}

export type IResponseFeedback = TMetaData & {
  rating: number
  content: string
  orderDetailId: string
  mediaFiles: TServerFile[]
  author: TUser
}

export type ISubmitFeedback = ISubmitFeedbackScheme
