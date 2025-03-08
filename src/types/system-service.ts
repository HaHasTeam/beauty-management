import { ISystemServiceFormData } from '@/schemas/system-service.schema'

import { ICategory } from './category'
import {
  IResponseConsultationCriteriaData,
  IUpdateConsultationCriteriaData,
  IUpdateServerConsultationCriteriaData
} from './consultation-criteria'
import { ServiceTypeEnum, StatusEnum } from './enum'
import { IImage } from './image'
import { TMetaData } from './request'

export type IUpdateSystemServiceFormData = ISystemServiceFormData & {
  id: string
  consultationCriteriaData: IUpdateConsultationCriteriaData
}
export type IUpdateServerSystemServiceFormData = {
  id: string
  name: string
  description: string
  type: ServiceTypeEnum
  status: StatusEnum.ACTIVE | StatusEnum.INACTIVE
  consultationCriteria?: string
  images: IImage[]
  category: string
  consultationCriteriaData?: IUpdateServerConsultationCriteriaData
}

export type ISystemService = {
  name: string
  description: string
  type: ServiceTypeEnum
  status: StatusEnum.ACTIVE | StatusEnum.INACTIVE
  consultationCriteria: IResponseConsultationCriteriaData
  images: IImage[]
  category: ICategory
}

export type ICreateSystemService =
  | ISystemServiceFormData
  | {
      images: IImage[]
    }

export type IResponseSystemService = TMetaData & ISystemService
