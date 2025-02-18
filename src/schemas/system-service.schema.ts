import i18next from 'i18next'
import { z } from 'zod'

import { ServiceTypeEnum, StatusEnum } from '@/types/enum'

import { resultSheetDataSchema } from './result-sheet.schema'

// Schema for the entire form
export const getSystemServiceSchema = () => {
  // const ResultSheetSectionSchema = getResultSheetSectionSchema()
  const fileArray = z.array(z.instanceof(File))

  // const resultSheetDataSchema = z
  //   .object({
  //     title: z.string().min(1, { message: i18next.t('systemService.resultSheetTitleRequired') }),
  //     resultSheetSections: z
  //       .array(ResultSheetSectionSchema)
  //       .min(1, { message: i18next.t('systemService.resultSheetSectionsRequired') })
  //   })
  //   .optional()

  return z
    .object({
      name: z.string().min(1, { message: i18next.t('systemService.serviceNameRequired') }),
      description: z.string().min(1, { message: i18next.t('systemService.descriptionRequired') }),
      images: fileArray.min(1, { message: i18next.t('systemService.imagesRequired') }),
      category: z.string().min(1, { message: i18next.t('systemService.categoryRequired') }),
      type: z.enum([ServiceTypeEnum.STANDARD, ServiceTypeEnum.PREMIUM]),
      resultSheet: z.string().optional(),
      resultSheetData: resultSheetDataSchema,
      status: z.enum([StatusEnum.ACTIVE, StatusEnum.INACTIVE])
    })
    .refine(
      (data) => {
        // Check if either resultSheet or resultSheetData is provided
        return !!(data.resultSheet || data.resultSheetData)
      },
      {
        message: i18next.t('systemService.eitherResultSheetOrDataRequired'),
        path: ['resultSheetData']
      }
    )
}

export const SystemServiceSchema = getSystemServiceSchema()

export type ISystemServiceFormData = z.infer<typeof SystemServiceSchema>
export type IResultSheetDataFormData = z.infer<typeof SystemServiceSchema>['resultSheetData']
