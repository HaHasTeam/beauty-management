import { TBrand } from './brand'
import { TProduct } from './product'
import { TMetaData } from './request'

export type TFlashSale = TMetaData & {
  startTime: string
  endTime: string
  discount: number
  product: TProduct
  brand: TBrand
  images: string[]
  status: FlashSaleStatusEnum
}

export enum FlashSaleStatusEnum {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED'
}
