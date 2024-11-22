import { IBrand } from './Brand'
import { ICategory } from './Category'
import { IImage } from './Image'

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
