export type IBrand = {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  logo: string
  document: string
  description: string
  email: string
  phone: string
  address: string
  star: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}
