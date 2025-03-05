import { IConsultationCriteriaSectionFormData } from '@/schemas/consultation-criteria.schema'
import { IConsultationCriteriaDataFormData } from '@/schemas/system-service.schema'

export type UpdateConsultationCriteriaParams = { params: string; data: IConsultationCriteriaDataFormData }

export type IImportConsultationCriteria = { fileName: string; data: IConsultationCriteriaSectionFormData[] }
