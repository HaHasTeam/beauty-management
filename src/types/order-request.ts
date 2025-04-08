import { OrderRequestTypeEnum } from './enum'
import { TServerFile } from './file'
import { IOrder } from './order'
import { TMetaData } from './request'
import { TUserFull } from './user'

export enum OrderRequestStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface TOrderRequest extends TMetaData {
  reason: string
  mediaFiles: TServerFile[]
  reasonRejected?: string
  order?: IOrder
  updatedBy?: TUserFull
  type: OrderRequestTypeEnum
  rejectedRefundRequest?: TOrderRequest
  refundRequest?: TOrderRequest
  status: OrderRequestStatusEnum
}
