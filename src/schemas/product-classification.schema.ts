import i18next from 'i18next'
import { z } from 'zod'

export const getUpdateProductClassificationsQuantitySchema = () => {
  return z.object({
    classifications: z.array(
      z.object({
        classificationId: z.string().min(1),
        quantity: z.number().min(1, i18next.t('productFormMessage.quantityValidate'))
      })
    )
  })
}
