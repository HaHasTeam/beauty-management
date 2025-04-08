import { IBranch2 } from './Branch'
import { BookingStatusEnum, BookingTypeEnum, PaymentMethod } from './enum'
import { TMetaData } from './request'
import { TSlot } from './slot'
import { TUser } from './user'

export type TBooking = TMetaData & {
  voucherDiscount: number
  totalPrice: number
  startTime: string
  endTime: string
  paymentMethod: PaymentMethod
  notes: string
  meetUrl: string
  record: string
  type: BookingTypeEnum
  status: BookingStatusEnum
  consultantService: null
  brand?: IBranch2
  account?: TUser
  slot: TSlot
  resultNote: string
}

export type CalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
  resource: TBooking
}
