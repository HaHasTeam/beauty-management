import { StatusEnum } from './enum'

export type IBranch = {
  id?: string
  name: string
  logo?: string
  document: string
  description?: string
  email: string
  phone?: string
  address?: string
  status?: StatusEnum
}
