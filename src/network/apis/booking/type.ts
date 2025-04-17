import { BookingStatusEnum, BookingTypeEnum, ServiceTypeEnum } from '@/types/enum'
import { BaseParams } from '@/types/request'

export type TRequestCreateBookingParams = {
  //"totalPrice": 100,
  startTime: string
  endTime: string
  //"voucherDiscount": "20",
  //"paymentMethod": "CASH",
  //"voucher": "id",
  //"consultantService": "id",
  notes?: string
  type: BookingTypeEnum
  status: BookingStatusEnum
  slot: string
  brandId: string
}

export type TFilterBookingsParams = BaseParams<{
  consultantServiceId?: string
  consultantAccountId?: string
  systemServiceType?: ServiceTypeEnum
  statuses?: string // comma-separated list of statuses
  minTotalPrice?: number
  maxTotalPrice?: number
  feedbackRating?: number
  startDate?: string
  endDate?: string
  search?: string
  type?: BookingTypeEnum
}>

export type TUpdateStatusBookingParams = {
  id: string
  status: BookingStatusEnum
  startTime: string
  endTime: string
}

export type TAssignUserBookingParams = {
  id: string
  assigneeId: string
}

export type TNoteResultBookingParams = {
  id: string
  resultNote: string
}

export type BookingStatusResponse = {
  message: string
  data: BookingStatusEnum
}
