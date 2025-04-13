import { IConsultantService } from '@/types/consultant-service'

export type AddConsultantServiceRequestParams = Pick<
  IConsultantService,
  'images' | 'price' | 'serviceBookingFormData' | 'description'
> & {
  systemService: string
}

export type GetConsultantServiceByIdRequestParams = {
  consultantServiceId: string
}

export type UpdateConsultantServiceByIdRequestParams = Partial<Omit<IConsultantService, 'systemService'>> & {
  systemService?: string
}

export interface GetConsultantServiceFilterRequestParams {
  page?: number
  limit?: number
  sortBy?: string
  order?: 'ASC' | 'DESC'
  price?: string | number
  statuses?: string
  systemService?: string
}
