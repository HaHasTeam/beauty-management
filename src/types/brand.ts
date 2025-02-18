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
  BANNED = 'BANNED',
  DENIED = 'DENIED'
}
export enum StatusEnum {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED',
  DENIED = 'DENIED'
}
export type IBrand = {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  logo: string
  document: string
  description: string
  email: string
  phone: string
  address: string
  star: number
  status: BrandStatusEnum
  businessTaxCode: string
  businessRegistrationCode: string
  establishmentDate: string
  ward: string
  district: string
  province: string
}
