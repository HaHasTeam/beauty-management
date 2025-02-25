import i18next from 'i18next'
import { z } from 'zod'

// Schema for result sheet section
export const getResultSheetSectionSchema = () => {
  return z.object({
    id: z.string().optional(),
    section: z.string().min(1, { message: i18next.t('systemService.sectionNameRequired') }),
    orderIndex: z.number().min(1, { message: i18next.t('systemService.orderIndexRequired') }),
    mandatory: z.boolean(),
    description: z.string().min(1, { message: i18next.t('systemService.sectionDescriptionRequired') })
  })
}

export const ResultSheetSectionSchema = getResultSheetSectionSchema()

export const getResultSheetDataSchema = () => {
  const ResultSheetSectionSchemaData = z.object({
    id: z.string().optional(),
    section: z.string().min(1, { message: i18next.t('systemService.sectionNameRequired') }),
    orderIndex: z.number().min(1, { message: i18next.t('systemService.orderIndexRequired') }),
    mandatory: z.boolean(),
    description: z.string().min(1, { message: i18next.t('systemService.sectionDescriptionRequired') })
  })

  return z.object({
    id: z.string().optional(),
    title: z.string().min(1, { message: i18next.t('systemService.resultSheetTitleRequired') }),
    resultSheetSections: z
      .array(ResultSheetSectionSchemaData)
      .min(1, { message: i18next.t('systemService.resultSheetSectionsRequired') })
  })
}

export const ResultSheetDataSchema = getResultSheetDataSchema()
export type IResultSheetSectionFormData = z.infer<typeof ResultSheetSectionSchema>
export type IResultSheetDataFormData = z.infer<typeof ResultSheetDataSchema>
