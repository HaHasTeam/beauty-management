import { TBrand } from './brand'
import { StatusEnum } from './enum'
import { TMetaData } from './request'

export type TVoucher = TMetaData & {
  name: string

  code: string

  type: string

  discountType: string

  discountValue: number

  maxDiscount?: number

  minOrderValue?: number

  description?: string

  status: StatusEnum

  amount?: number

  startTime: Date

  endTime: Date

  brand?: TBrand | string
}
