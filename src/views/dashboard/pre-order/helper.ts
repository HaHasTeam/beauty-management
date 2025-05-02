import i18next from 'i18next'
import _ from 'lodash'
import { z } from 'zod'

import { defaultRequiredRegex } from '@/constants/regex'
import { TAddPreOderRequestParams, TUpdatePreOrderRequestParams } from '@/network/apis/pre-order/type'
import { TClassification } from '@/types/classification'
import { TPreOrder } from '@/types/pre-order'
import { fileArray, skuRegex } from '@/variables/productFormDetailFields'

export const formSchema = z
  .object({
    id: z.string().optional(),
    product: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message()),
    startTime: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message()),
    endTime: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message()),
    productClassifications: z
      .array(
        z.object({
          id: z.string().min(0).optional(),
          title: z
            .string()
            .min(1, { message: i18next.t('productFormMessage.classificationTitleRequired') })
            .optional(),
          sku: z
            .string()
            .min(1, { message: i18next.t('productFormMessage.SKURequiredLength') })
            .regex(skuRegex, { message: i18next.t('productFormMessage.SKURegex') })
            .optional(),
          type: z.string().min(0).optional(),
          price: z
            .number()
            .min(1000, { message: i18next.t('productFormMessage.priceValidate') })
            .optional(),
          quantity: z
            .number()
            .min(1, { message: i18next.t('productFormMessage.quantityValidate') })
            .optional(),
          images: fileArray.min(1, { message: i18next.t('productFormMessage.imagesRequired') }).optional(),
          color: z.string().optional(),
          size: z.string().optional(),
          other: z.string().optional()
        })
      )
      .min(1, { message: defaultRequiredRegex.message() })
  })
  .superRefine((data, ctx) => {
    const startTime = new Date(data.startTime).getTime()
    const endTime = new Date(data.endTime).getTime()

    if (startTime >= endTime) {
      return ctx.addIssue({
        code: 'custom',
        message: 'Please select end time after start time',
        path: ['endTime']
      })
    }
  })

export type SchemaType = z.infer<typeof formSchema>

export const convertFormToPreProduct = (form: Partial<SchemaType>) => {
  const result: TAddPreOderRequestParams | TUpdatePreOrderRequestParams = {
    id: form.id ?? undefined,
    startTime: form.startTime,
    endTime: form.endTime,
    productClassifications: form.productClassifications as unknown as TClassification[],
    product: form.product
  }

  return _.omitBy(result, (value) => Boolean(value) == false)
}

export const convertPreProductToForm = (preProduct: TPreOrder): SchemaType => {
  return {
    id: preProduct.id,
    product: preProduct.product.id,
    startTime: preProduct.startTime,
    endTime: preProduct.endTime,
    productClassifications: preProduct.productClassifications as unknown as SchemaType['productClassifications']
  }
}
