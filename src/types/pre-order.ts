import { TClassification } from './classification'
import { TProduct } from './product'
import { TMetaData } from './request'

export type TPreOrder = TMetaData & {
  startTime: string
  endTime: string
  status: PreOrderStatusEnum
  product: TProduct
  productClassifications: TClassification[]
}

export enum PreOrderStatusEnum {
  ACTIVE = 'ACTIVE',
  SOLD_OUT = 'SOLD_OUT',
  WAITING = 'WAITING',
  INACTIVE = 'INACTIVE'
}
