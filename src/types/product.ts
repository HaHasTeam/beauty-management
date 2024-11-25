import { IBrand } from './brand'
import { ICategory } from './category'
import { IImage } from './productImage'

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
