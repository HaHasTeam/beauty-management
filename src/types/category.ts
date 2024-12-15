export interface ICategoryDetail {
  field1: {
    type: string
  }
  field2: {
    type: string
    options: string[]
  }
}

export interface ICategory {
  id: string
  name: string
  createdAt?: string
  updatedAt?: string
  detail?: object
  parentCategory?: ICategory | null
  subCategories?: ICategory[]
}
