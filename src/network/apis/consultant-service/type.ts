import { IConsultantService } from '@/types/consultant-service'

export type AddConsultantServiceRequestParams = Pick<
  IConsultantService,
  'images' | 'price' | 'serviceBookingFormData'
> & {
  systemService: string
}

export type GetConsultantServiceByIdRequestParams = {
  consultantServiceId: string
}

export type UpdateConsultantServiceByIdRequestParams = Partial<Omit<IConsultantService, 'systemService'>> & {
  systemService?: string
}
