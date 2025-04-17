import { IBooking } from './booking'
import { WeekDay } from './enum'
import { TMetaData } from './request'
import { TUser } from './user'

export type TSlot = TMetaData & {
  weekDay: WeekDay
  startTime: string
  endTime: string
  isActive?: boolean
  accounts?: TUser[] // Accounts using this slot as working slot
}

export type TSlotCreate = {
  weekDay: WeekDay
  startTime: string
  endTime: string
  isActive?: boolean
}

export type ISlot = TMetaData & {
  weekDay: WeekDay
  startTime: string
  endTime: string
  bookings: IBooking[]
}

export type TBulkSlotCreate = {
  slots: TSlotCreate[]
}

export type TSlotResponse = {
  slots: TSlot[]
}

// Working slot relationship (many-to-many join table)
export type TWorkingSlot = {
  accountId: string
  slotId: string
}
