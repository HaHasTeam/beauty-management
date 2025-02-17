import i18next from 'i18next'
import { z } from 'zod'

import { ServiceTypeEnum, StatusEnum } from '@/types/enum'

// Schema for result sheet section
export const getResultSheetSectionSchema = () => {
  return z.object({
    section: z.string().min(1, { message: i18next.t('systemService.sectionNameRequired') }),
    orderIndex: z.number().min(1, { message: i18next.t('systemService.orderIndexRequired') }),
    mandatory: z.boolean(),
    description: z.string().min(1, { message: i18next.t('systemService.sectionDescriptionRequired') })
  })
}

// Schema for the entire form
export const getSystemServiceSchema = () => {
  const ResultSheetSectionSchema = getResultSheetSectionSchema()
  const fileArray = z.array(z.instanceof(File))
  return z.object({
    name: z.string().min(1, { message: i18next.t('systemService.serviceNameRequired') }),
    description: z.string().min(1, { message: i18next.t('systemService.descriptionRequired') }),
    images: fileArray.min(1, { message: i18next.t('systemService.imagesRequired') }),
    category: z.string().min(1, { message: i18next.t('systemService.categoryRequired') }),
    type: z.enum([ServiceTypeEnum.STANDARD, ServiceTypeEnum.PREMIUM]),
    resultSheetData: z.object({
      title: z.string().min(1, { message: i18next.t('systemService.resultSheetTitleRequired') }),
      resultSheetSections: z.array(ResultSheetSectionSchema)
    }),
    status: z.enum([StatusEnum.ACTIVE, StatusEnum.INACTIVE])
  })
}

export const SystemServiceSchema = getSystemServiceSchema()

export type ISystemServiceFormData = z.infer<typeof SystemServiceSchema>
