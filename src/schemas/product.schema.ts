import i18next from 'i18next'
import { z } from 'zod'

export const getUpdateProductStatusSchema = () => {
  return z.object({
    status: z.string().min(1, i18next.t('validation.statusRequired'))
  })
}
