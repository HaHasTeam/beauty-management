import { IConsultationCriteriaSectionFormData } from '@/schemas/consultation-criteria.schema'

import { StatusEnum } from './enum'
import { TMetaData } from './request'
import { IResponseSystemService } from './system-service'

export type IUpdateConsultationCriteriaSection = IConsultationCriteriaSectionFormData & {
  id?: string
  status?: StatusEnum
}
export type IResponseConsultationCriteriaSection = IConsultationCriteriaSectionFormData &
  TMetaData & {
    status: StatusEnum
  }

export type IUpdateConsultationCriteriaData = {
  id: string
  title: string
  consultationCriteriaSections: IUpdateConsultationCriteriaSection[]
}
export type IUpdateServerConsultationCriteriaData = {
  id?: string
  title: string
  consultationCriteriaSections: IUpdateConsultationCriteriaSection[]
}

export type IResponseConsultationCriteriaData = {
  id: string
  title: string
  consultationCriteriaSections: IResponseConsultationCriteriaSection[]
  status: StatusEnum
  systemServices: IResponseSystemService[]
  createdAt: string
  updatedAt: string
}
