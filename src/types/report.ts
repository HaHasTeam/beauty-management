import { TBooking } from './booking'
import { TFile } from './file'
import { IOrder } from './order'
import { TMetaData } from './request'
import { ITransaction } from './transaction'
import { TUser } from './user'

export type IReport = TMetaData & {
  reason: string
  files: TFile[]
  order?: IOrder
  booking?: TBooking
  transaction?: ITransaction
  type: ReportTypeEnum
  status: ReportStatusEnum
  reporter: TUser
  assignee?: TUser
  resultNote?: string
}

export enum ReportTypeEnum {
  ORDER = 'ORDER',
  TRANSACTION = 'TRANSACTION',
  BOOKING = 'BOOKING',
  SYSTEM_FEATURE = 'SYSTEM_FEATURE',
  OTHER = 'OTHER'
}

export enum ReportStatusEnum {
  PENDING = 'PENDING',
  IN_PROCESSING = 'IN_PROCESSING',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED'
}
