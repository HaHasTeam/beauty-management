import i18next from 'i18next'
import { z } from 'zod'

import { ServiceTypeEnum } from '@/types/enum'
import { SystemServiceStatusEnum } from '@/types/system-service'

import { getConsultationCriteriaSectionSchema } from './consultation-criteria.schema'

// Schema for the entire form
export const getSystemServiceSchema = () => {
  // const ConsultationCriteriaSectionSchema = getConsultationCriteriaSectionSchema()
  const fileArray = z.array(z.instanceof(File))
  const ConsultationCriteriaSectionSchema = getConsultationCriteriaSectionSchema()

  const consultationCriteriaDataSchema = z
    .object({
      id: z.string().optional(),
      title: z.string().min(1, { message: i18next.t('systemService.consultationCriteriaTitleRequired') }),
      consultationCriteriaSections: z
        .array(ConsultationCriteriaSectionSchema)
        .min(1, { message: i18next.t('systemService.consultationCriteriaSectionsRequired') })
    })
    .optional()

  return z
    .object({
      name: z.string().min(1, { message: i18next.t('systemService.serviceNameRequired') }),
      description: z.string().min(1, { message: i18next.t('systemService.descriptionRequired') }),
      images: fileArray.min(1, { message: i18next.t('systemService.imagesRequired') }),
      category: z.string().min(1, { message: i18next.t('systemService.categoryRequired') }),
      type: z.enum([ServiceTypeEnum.STANDARD, ServiceTypeEnum.PREMIUM]),
      consultationCriteria: z.string().optional(),
      consultationCriteriaData: consultationCriteriaDataSchema,
      status: z.nativeEnum(SystemServiceStatusEnum)
    })
    .refine(
      (data) => {
        // Check if either consultationCriteria or consultationCriteriaData is provided
        return !!(data.consultationCriteria || data.consultationCriteriaData)
      },
      {
        message: i18next.t('systemService.eitherConsultationCriteriaOrDataRequired'),
        path: ['consultationCriteriaData']
      }
    )
}

export const getUpdateSystemServiceStatusSchema = () => {
  return z.object({
    status: z.string().min(1, i18next.t('validation.statusRequired'))
  })
}

export const SystemServiceSchema = getSystemServiceSchema()

export type ISystemServiceFormData = z.infer<typeof SystemServiceSchema>
export type IConsultationCriteriaDataFormData = z.infer<typeof SystemServiceSchema>['consultationCriteriaData']
