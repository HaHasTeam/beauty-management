import i18next from 'i18next'
import { z } from 'zod'

import { BlogEnum } from '@/types/enum'

export const getFormBlogSchema = () => {
  return z.object({
    title: z.string().min(1, i18next.t('validation.required')),
    tag: z
      .string()
      .min(3, i18next.t('validation.tagRequired'))
      .max(100, i18next.t('validation.tagRequiredMax'))
      .regex(/^[a-z0-9-]+$/, i18next.t('validation.tagRegex')),
    content: z.string().refine((val) => val.replace(/<[^>]*>/g, '').trim().length > 0, {
      message: i18next.t('validation.required')
    }),
    status: z.nativeEnum(BlogEnum)
  })
}

export const FormBlogSchema = getFormBlogSchema()
export type IFormBlogSchema = z.infer<typeof FormBlogSchema>
