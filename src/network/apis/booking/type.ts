import { BookingStatusEnum, BookingTypeEnum } from '@/types/enum'

export type TRequestCreateBookingParams = {
  //"totalPrice": 100,
  startTime: string
  endTime: string
  //"voucherDiscount": "20",
  //"paymentMethod": "CASH",
  //"voucher": "id",
  //"consultantService": "id",
  notes: string
  type: BookingTypeEnum
  status: BookingStatusEnum
  slot: string
  account: string
}
