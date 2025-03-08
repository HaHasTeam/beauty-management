import i18next from 'i18next'
import { z } from 'zod'

// Schema for result sheet section
export const getConsultationCriteriaSectionSchema = () => {
  return z.object({
    id: z.string().optional(),
    section: z.string().min(1, { message: i18next.t('systemService.sectionNameRequired') }),
    orderIndex: z.number().min(1, { message: i18next.t('systemService.orderIndexRequired') }),
    mandatory: z.boolean(),
    description: z.string().min(1, { message: i18next.t('systemService.sectionDescriptionRequired') })
  })
}

export const ConsultationCriteriaSectionSchema = getConsultationCriteriaSectionSchema()

export const getConsultationCriteriaDataSchema = () => {
  const ConsultationCriteriaSectionSchemaData = z.object({
    id: z.string().optional(),
    section: z.string().min(1, { message: i18next.t('systemService.sectionNameRequired') }),
    orderIndex: z.number().min(1, { message: i18next.t('systemService.orderIndexRequired') }),
    mandatory: z.boolean(),
    description: z.string().min(1, { message: i18next.t('systemService.sectionDescriptionRequired') })
  })

  return z.object({
    id: z.string().optional(),
    title: z.string().min(1, { message: i18next.t('systemService.consultationCriteriaTitleRequired') }),
    consultationCriteriaSections: z
      .array(ConsultationCriteriaSectionSchemaData)
      .min(1, { message: i18next.t('systemService.consultationCriteriaSectionsRequired') })
  })
}

export const ConsultationCriteriaDataSchema = getConsultationCriteriaDataSchema()
export type IConsultationCriteriaSectionFormData = z.infer<typeof ConsultationCriteriaSectionSchema>
export type IConsultationCriteriaDataFormData = z.infer<typeof ConsultationCriteriaDataSchema>
