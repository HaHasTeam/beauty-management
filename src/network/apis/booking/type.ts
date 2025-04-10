import { BookingStatusEnum, BookingTypeEnum } from '@/types/enum'

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
