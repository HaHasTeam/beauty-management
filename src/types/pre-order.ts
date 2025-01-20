import { IClassification, TClassification } from './classification'
import { IProduct, TProduct } from './product'
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

export type IPreOrder = TMetaData & {
  startTime: string
  endTime: string
  status: PreOrderProductEnum
  product: IProduct
  productClassifications: IClassification[]
  // images?: IImage[]
}
export enum PreOrderProductEnum {
  ACTIVE = 'ACTIVE',
  SOLD_OUT = 'SOLD_OUT',
  WAITING = 'WAITING',
  INACTIVE = 'INACTIVE',
  CANCELLED = 'CANCELLED'
}
