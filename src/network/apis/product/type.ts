import { BaseParams } from '@/types/request'

export type TGetProductByBrandIdRequestParams = {
  brandId: string
}

export type TGetProductFilterRequestParams = BaseParams<{
  search?: string
  brandId?: string
  categoryId?: string
  maxPrice?: string
  minPrice?: string
  statuses?: string
}>
