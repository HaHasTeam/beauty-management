import { IBrand } from './brand'
import { ICategory } from './category'
import { IImage } from './productImage'

export type IProductImage = {
  id?: string
  name?: string
  fileUrl?: string
  status?: string
}
export type IProductClassification = {
  id?: string
  title: string
  price?: number
  quantity: number
  status?: string
}

export type IProduct = {
  id: string
  name: string
  brand?: IBrand
  category?: ICategory
  description?: string
  detail?: string
  productClassifications: IProductClassification[]
  images?: IImage[]
  price: number
  quantity: number
  status?: string
}
export type ICreateProduct = {
  id?: string
  name: string
  brand?: string
  category?: string
  images: IProductImage[]
  description: string
  status: string
  detail?: {
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
  productClassifications?: {
    id?: string
    title?: string
    price?: number
    quantity?: number
    image?: string | null
    status?: string
  }[]
  price?: number
  quantity?: number
}
export type IServerCreateProduct = {
  id?: string
  name: string
  brand?: string
  category?: string
  images: IProductImage[]
  description: string
  status: string
  detail?: string
  productClassifications?: {
    id?: string
    title?: string
    price?: number
    quantity?: number
    image?: string | null
    status?: string
  }[]
  price?: number
  quantity?: number
}
export type IResponseProduct = {
  id: string
  name: string
  brand?: {
    id: string
    name: string
    logo: string
    description?: string
    email?: string
    phone?: string
    address?: string
    document?: string
    status?: string
  }
  category?: {
    id: string
    name: string
    detail?: {
      [key: string]: {
        type: string
        options?: string[]
      }
    }
  }
  images: {
    id?: string
    name: string
    fileUrl: string
    status?: string
  }[]
  description: string
  status: string
  detail?: {
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
  productClassifications?: {
    id?: string
    title?: string
    price?: number
    quantity?: number
    image?: string | null
    status?: string
  }[]
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
