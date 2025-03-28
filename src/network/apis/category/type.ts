import { ICategory } from '@/types/category'

export type AddCategoryRequestParams = Pick<ICategory, 'name' | 'detail'> & {
  parentCategoryId?: string
}

export type GetCategoryByIdRequestParams = {
  categoryId: string
}

export type CategoryResponse = Omit<ICategory, 'parentCategory' | 'subCategories'> & {
  parentCategory?: string
  subCategories?: string[]
}

export type UpdateCategoryByIdRequestParams = Partial<Omit<ICategory, 'parentCategory'>> & {
  parentCategory?: string
}

export interface GetCategoryFilterRequestParams {
  page?: number
  limit?: number
  sortBy?: string
  order?: 'ASC' | 'DESC'
  name?: string
  statuses?: string
}
