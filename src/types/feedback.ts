import { TServerFile } from './file'
import { IOrderDetailFeedback } from './order'
import { TMetaData } from './request'
import { TUser, TUserFeedback } from './user'

export type ISubmitFeedbackScheme = {
  rating: number
  content: string
  orderDetailId: string
  mediaFiles: string[]
}

export type IReplyFeedback = TMetaData & {
  content: string
  account: TUserFeedback
}

export type IResponseFeedback = TMetaData & {
  rating: number
  content: string
  orderDetailId: string
  mediaFiles: TServerFile[]
  author: TUser
  replies: IReplyFeedback[]
}

export type ISubmitFeedback = ISubmitFeedbackScheme
export type IResponseFilterFeedback = TMetaData & {
  rating: number
  content: string
  mediaFiles: TServerFile[]
  replies: IReplyFeedback[]
  orderDetail: IOrderDetailFeedback
}
