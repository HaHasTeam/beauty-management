import { TBrand } from './brand'
import { TMetaData } from './request'

export type TProduct = TMetaData & {
  name: string
  description: string
  detail: string
  brand: TBrand
  images: string[]
  status: ProductStatusEnum
}
export enum ProductStatusEnum {
  FLASH_SALE = 'FLASH_SALE',
  OFFICIAL = 'OFFICIAL',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED'
}
