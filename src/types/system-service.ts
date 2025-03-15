import { ISystemServiceFormData } from '@/schemas/system-service.schema'

import { ICategory } from './category'
import {
  IResponseConsultationCriteriaData,
  IUpdateConsultationCriteriaData,
  IUpdateServerConsultationCriteriaData
} from './consultation-criteria'
import { ServiceTypeEnum } from './enum'
import { IImage } from './image'
import { TMetaData } from './request'

export enum SystemServiceStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export type IUpdateSystemServiceFormData = ISystemServiceFormData & {
  id: string
  consultationCriteriaData: IUpdateConsultationCriteriaData
}
export type IUpdateServerSystemServiceFormData = {
  id: string
  name: string
  description: string
  type: ServiceTypeEnum
  status: SystemServiceStatusEnum
  consultationCriteria?: string
  images: IImage[]
  category: string
  consultationCriteriaData?: IUpdateServerConsultationCriteriaData
}

export type ISystemService = TMetaData & {
  name: string
  description: string
  type: ServiceTypeEnum
  status: SystemServiceStatusEnum
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
