import { FeedbackFilterEnum } from '@/types/enum'

export type IFilterFeedbackData = {
  value: string
  type: FeedbackFilterEnum
}
export type IFilterFeedback = {
  params: string
  data: IFilterFeedbackData
}
export type IReplyFeedbackData = {
  content: string
}
export type IReplyFeedback = {
  params: string
  content: string
}
