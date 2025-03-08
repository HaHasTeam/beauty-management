import { BrandStatusEnum, StatusEnum } from './brand'

export type IBranch = {
  id?: string
  name: string
  logo?: string
  documents: string[]
  description?: string
  email: string
  phone?: string
  address?: string
  province?: string
  district?: string
  ward?: string
  businessTaxCode?: string
  businessRegistrationCode?: string
  establishmentDate?: string | Date
  businessRegistrationAddress?: string
  status?: StatusEnum
}
interface Document {
  id: string
  createdAt: string
  updatedAt: string
  name: string | null
  fileUrl: string
  type: string
  status: string
}
export interface IBranch2 {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  logo: string
  description: string
  email: string
  phone: string
  address: string
  businessTaxCode: string
  businessRegistrationCode: string
  establishmentDate: string
  province: string
  district: string
  ward: string
  businessRegistrationAddress: string
  star: number
  currentUpdateProfileTime: number
  status: BrandStatusEnum
  documents: Document[]
}
