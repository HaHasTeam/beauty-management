import { IBrand } from './brand'
import { ICategory } from './category'
import { IImage } from './productImage'

export type IProductDetail = {
  organizationName?: string[]
  organizationAddress?: string[]
  ingredients?: string
  expiryPeriod?: string[]
  volume?: string[]
  batchNumber?: string
  expiryDate?: string
  origin?: string[]
  weight?: string[]
  packagingType?: string[]
  formula?: string[]
  activeIngredients?: string[]
  skinType?: string[]
  productType?: string[]
  skinCare?: string[]
  specialFeatures?: string[]
  versionType?: string[]
  quantityPerPack?: string[]
  storageCondition?: string[]
}

export type IProductClassification = {
  id?: string
  title?: string
  price?: number
  quantity?: number
  image?: string
  status?: string
  type?: string
}

export type ICreateProduct = {
  id?: string
  name: string
  brand?: string
  category?: string
  images: string[]
  description: string
  status: string
  detail?: IProductDetail
  productClassifications?: IProductClassification[]
  price?: number
  quantity?: number
}
export type IServerCreateProduct = {
  id?: string
  name: string
  brand?: string
  category?: string
  images: IImage[]
  description: string
  status: string
  detail?: string
  productClassifications?: IProductClassification[]
  price?: number
  quantity?: number
}
export type IResponseProduct = {
  id: string
  name: string
  brand?: IBrand
  category?: ICategory
  images: IImage[]
  description: string
  status?: string
  detail?: string
  productClassifications?: IProductClassification[]
  price?: number
  quantity?: number
}

export type IProductTable = {
  checked?: string
  id: string
  name: string
  price: number
  quantity: number
  description: string
  detail: string
  brand: string
  category: string
  menu?: string
}

export enum ProductEnum {
  PRE_ORDER = 'PRE_ORDER',
  FLASH_SALE = 'FLASH_SALE',
  OFFICIAL = 'OFFICIAL',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  INACTIVE = 'INACTIVE'
}
export enum ProductClassificationTypeEnum {
  DEFAULT = 'DEFAULT',
  CUSTOM = 'CUSTOM'
}
