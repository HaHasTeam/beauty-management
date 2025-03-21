import { z } from 'zod'

import { defaultRequiredRegex } from '@/constants/regex'
import { CategoryTypeEnum, InputTypeEnum } from '@/types/category'

const optionSchema = z.object({
  label: z.string(),
  value: z.string()
})
export const categoryTypeSchema = z
  .object({
    label: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
    required: z.boolean(),
    type: z.nativeEnum(CategoryTypeEnum),
    inputType: z.nativeEnum(InputTypeEnum).optional(),
    options: z
      .array(optionSchema)
      .nonempty({
        message: defaultRequiredRegex.message
      })
      .optional(),
    onlyFutureDates: z.boolean().optional(),
    onlyPastDates: z.boolean().optional(),
    order: z.number().optional()
  })
  .superRefine((data, ctx) => {
    const { type } = data
    if (type === CategoryTypeEnum.input) {
      if (!data.inputType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: defaultRequiredRegex.message,
          path: ['inputType']
        })
      }
    }
    if (type === CategoryTypeEnum.singleChoice || type === CategoryTypeEnum.multipleChoice) {
      if (!data.options?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: defaultRequiredRegex.message,
          path: ['options']
        })
      }
    }
  })

export type CategoryType = z.infer<typeof categoryTypeSchema>
export const formSchema = z.object({
  name: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  detail: z.record(categoryTypeSchema).optional(),
  parentCategory: z.string().optional(),
  subCategories: z.any().optional(),
  hasSubcategories: z.boolean().default(false),
  shouldInheritParent: z.boolean().default(true)
})

export type FormType = z.infer<typeof formSchema>

export const convertFormToCategory = (form: FormType) => {
  const category = {
    name: form.name,
    detail: form.detail,
    parentCategory: form.parentCategory
  }
  return category
}
