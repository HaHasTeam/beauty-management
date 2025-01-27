import { TFile } from './file'
import { ProductClassificationTypeEnum } from './product'
import { TMetaData } from './request'

export type TClassification = TMetaData & {
  title: string
  price: number
  quantity: number
  images: TFile[]
  sku: string
  type: ProductClassificationTypeEnum
  status: ClassificationStatusEnum
}

export enum ClassificationStatusEnum {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED'
}
