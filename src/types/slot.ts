import { WeekDay } from './enum'
import { TMetaData } from './request'

export type TSlot = TMetaData & {
  weekDay: WeekDay
  startTime: string
  endTime: string
  isActive?: boolean
}

export type TSlotCreate = {
  weekDay: WeekDay
  startTime: string
  endTime: string
  isActive?: boolean
}

export type TBulkSlotCreate = {
  slots: TSlotCreate[]
}

export type TSlotResponse = {
  slots: TSlot[]
}
