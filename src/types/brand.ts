import { TMetaData } from './request'

export type TBrand = TMetaData & {
  name: string
  logo: string
  document: string
  description: string
  email: string
  phone: string
  address: string
  star?: number
  status: BrandStatusEnum
}

export enum BrandStatusEnum {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED'
}
