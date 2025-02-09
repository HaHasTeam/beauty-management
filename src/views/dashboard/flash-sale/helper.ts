import { z } from 'zod'

import { defaultRequiredRegex } from '@/constants/regex'
import { TAddFlashSaleRequestParams, TUpdateFlashSaleRequestParams } from '@/network/apis/flash-sale/type'
import { TFlashSale } from '@/types/flash-sale'
import { ProductClassificationTypeEnum } from '@/types/product'

export const formSchema = z.object({
  id: z.string().optional(),
  product: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  startTime: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  endTime: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  // images: z
  //   .array(
  //     z.object({
  //       name: z.string(),
  //       fileUrl: z.string()
  //     })
  //   )
  //   .nonempty({
  //     message: requiredFileRegex.message
  //   }),
  discount: z.coerce
    .number({
      message: defaultRequiredRegex.message
    })
    .positive({
      message: defaultRequiredRegex.message
    }),
  productClassifications: z
    .array(
      z.object({
        rawClassification: z.object(
          {
            id: z.string().optional(),
            title: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
            price: z.coerce.number().positive({ message: defaultRequiredRegex.message }),
            quantity: z.coerce.number().int().positive({ message: defaultRequiredRegex.message }),
            sku: z.string().optional(),
            images: z.array(
              z.object({
                name: z.string(),
                fileUrl: z.string()
              })
            ),
            type: z.nativeEnum(ProductClassificationTypeEnum),
            originalClassification: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message)
          },
          {
            message: defaultRequiredRegex.message
          }
        ),
        append: z.object({
          quantity: z.coerce
            .number({
              message: defaultRequiredRegex.message
            })
            .positive({ message: defaultRequiredRegex.message })
        }),
        initialClassification: z
          .object({
            id: z.string().optional(),
            title: z.string().optional(),
            price: z.coerce.number().optional(),
            quantity: z.coerce.number().int().optional(),
            sku: z.string().optional(),
            images: z
              .array(
                z.object({
                  name: z.string(),
                  fileUrl: z.string()
                })
              )
              .optional(),
            type: z.nativeEnum(ProductClassificationTypeEnum).optional(),
            originalClassification: z
              .string()
              .regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message)
              .optional()
          })
          .optional()
      })
    )
    .nonempty({
      message: defaultRequiredRegex.message
    })
})

export type SchemaType = z.infer<typeof formSchema>

export const convertFormToFlashSale = (form: SchemaType) => {
  const result: TAddFlashSaleRequestParams | TUpdateFlashSaleRequestParams = {
    id: form.id ?? undefined,
    startTime: form.startTime,
    endTime: form.endTime,
    // images: form.images,
    discount: form.discount,
    productClassifications: form.productClassifications.map((item) => {
      return {
        ...item.rawClassification,
        ...item.append,
        originalClassification: !item.initialClassification?.id
          ? item.rawClassification.originalClassification
          : undefined
      }
    }),
    product: form.product
  }
  return result
}

export const convertFlashSaleToForm = (flashSale: TFlashSale): SchemaType => {
  return {
    id: flashSale.id,
    product: flashSale.product.id,
    startTime: flashSale.startTime,
    endTime: flashSale.endTime,
    // images: flashSale.images,
    discount: flashSale.discount,
    productClassifications: flashSale.productClassifications.map((item) => ({
      rawClassification: {
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        sku: item.sku ?? '',
        images: item.images,
        type: item.type,
        originalClassification: item.id
      },
      append: {
        quantity: item.quantity
      },
      initialClassification: {
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        sku: item.sku ?? '',
        images: item.images,
        type: item.type,
        originalClassification: item.id
      }
    })) as SchemaType['productClassifications']
  }
}
