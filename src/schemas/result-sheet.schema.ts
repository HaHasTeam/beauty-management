import i18next from 'i18next'
import { z } from 'zod'

// Schema for result sheet section
export const getResultSheetSectionSchema = () => {
  return z.object({
    section: z.string().min(1, { message: i18next.t('systemService.sectionNameRequired') }),
    orderIndex: z.number().min(1, { message: i18next.t('systemService.orderIndexRequired') }),
    mandatory: z.boolean(),
    description: z.string().min(1, { message: i18next.t('systemService.sectionDescriptionRequired') })
  })
}

export const ResultSheetSectionSchema = getResultSheetSectionSchema()

export const resultSheetDataSchema = z
  .object({
    title: z.string().min(1, { message: i18next.t('systemService.resultSheetTitleRequired') }),
    resultSheetSections: z
      .array(ResultSheetSectionSchema)
      .min(1, { message: i18next.t('systemService.resultSheetSectionsRequired') })
  })
  .optional()

export type IResultSheetSectionFormData = z.infer<typeof ResultSheetSectionSchema>
