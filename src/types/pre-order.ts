import { TClassification } from './classification'
import { TProduct } from './product'
import { TMetaData } from './request'

export type TPreOrder = TMetaData & {
  startTime: string
  endTime: string
  status: PreOrderStatusEnum
  product: TProduct
  productClassifications: TClassification[]
  images?: string[]
}

export enum PreOrderStatusEnum {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED'
}
