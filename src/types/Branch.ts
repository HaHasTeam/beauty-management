import { StatusEnum } from './enum'

export type IBranch = {
  name: string
  logo?: string
  document: string
  description?: string
  email: string
  phone?: string
  address?: string
  status?: StatusEnum
}
