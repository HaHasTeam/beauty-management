import { ICategory } from '@/types/category'

export type FormType = Pick<ICategory, 'name' | 'detail'> & {
  parentCategory?: string
  subCategories?: FormType[]
  hasSubcategories?: boolean
  shouldInheritParent?: boolean
}

export const convertFormToCategory = (form: FormType) => {
  const category = {
    name: form.name,
    detail: form.detail,
    parentCategory: form.parentCategory
  }
  return category
}
