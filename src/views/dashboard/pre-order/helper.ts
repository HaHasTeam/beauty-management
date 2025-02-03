import { z } from 'zod'

import { defaultRequiredRegex } from '@/constants/regex'
import { TAddPreOderRequestParams, TUpdatePreOrderRequestParams } from '@/network/apis/pre-order/type'
import { TPreOrder } from '@/types/pre-order'
import { ProductClassificationTypeEnum } from '@/types/product'

export const formSchema = z
  .object({
    id: z.string().optional(),
    product: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
    startTime: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
    endTime: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
    productClassifications: z
      .array(
        z.object({
          rawClassification: z
            .object(
              {
                id: z.string().optional(),
                title: z
                  .string({
                    message: defaultRequiredRegex.message
                  })
                  .regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
                price: z.coerce
                  .number({
                    message: defaultRequiredRegex.message
                  })
                  .positive({ message: defaultRequiredRegex.message }),
                quantity: z.coerce.number().int().positive({ message: defaultRequiredRegex.message }),
                sku: z.string(),
                images: z.array(
                  z.object({
                    name: z.string(),
                    fileUrl: z.string()
                  })
                ),
                type: z.nativeEnum(ProductClassificationTypeEnum)
              },
              {
                message: defaultRequiredRegex.message
              }
            )
            .partial()
            .optional(),
          append: z.object({
            quantity: z.coerce
              .number({
                message: defaultRequiredRegex.message
              })
              .positive({ message: defaultRequiredRegex.message }),
            sku: z.string({ message: defaultRequiredRegex.message }),
            type: z.nativeEnum(ProductClassificationTypeEnum),
            images: z.array(
              z.object({
                id: z.string().optional(),
                name: z.string(),
                fileUrl: z.string()
              })
            ),
            title: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
            price: z.coerce
              .number({
                message: defaultRequiredRegex.message
              })
              .positive({ message: defaultRequiredRegex.message })
          })
        })
      )
      .nonempty({
        message: defaultRequiredRegex.message
      })
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

export const convertFormToPreProduct = (form: SchemaType) => {
  const result: TAddPreOderRequestParams | TUpdatePreOrderRequestParams = {
    id: form.id ?? undefined,
    startTime: form.startTime,
    endTime: form.endTime,
    productClassifications: form.productClassifications.map((item) => {
      return {
        ...item.rawClassification,
        ...item.append
      }
    }),
    product: form.product
  }
  return result
}

export const convertPreProductToForm = (preProduct: TPreOrder): SchemaType => {
  return {
    id: preProduct.id,
    product: preProduct.product.id,
    startTime: preProduct.startTime,
    endTime: preProduct.endTime,
    productClassifications: preProduct.productClassifications.map((item) => ({
      rawClassification: {
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        sku: item.sku ?? '',
        type: item.type
      },
      append: {
        sku: item.sku ?? '',
        title: item.title,
        price: item.price,
        type: item.type,
        images: item.images ?? [],
        quantity: item.quantity
      }
    })) as SchemaType['productClassifications']
  }
}
