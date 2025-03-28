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
            quantity: z.coerce.number().int().nonnegative({ message: defaultRequiredRegex.message }),
            sku: z.string().optional(),
            images: z.array(
              z.object({
                name: z.string(),
                fileUrl: z.string()
              })
            ),
            type: z.nativeEnum(ProductClassificationTypeEnum),
            originalClassification: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
            color: z.string().optional().nullable(),
            size: z.string().optional().nullable(),
            other: z.string().optional().nullable()
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
              .optional(),
            color: z.string().optional().nullable(),
            size: z.string().optional().nullable(),
            other: z.string().optional().nullable()
          })
          .optional()
      })
    )
    .nonempty({
      message: defaultRequiredRegex.message
    })
    .superRefine((value, ctx) => {
      const rawClassification = value ?? []

      for (let i = rawClassification.length - 1; i >= 0; i--) {
        const raw = rawClassification[i]
        const originalClassification = raw.rawClassification.originalClassification
        const lastIndex = rawClassification.findIndex((item, index) => {
          return index !== i && item.rawClassification.originalClassification === originalClassification
        })

        if (lastIndex !== -1) {
          return ctx.addIssue({
            message: 'Classification is duplicated.',
            code: 'custom',
            path: [i, 'rawClassification']
          })
        }
      }

      return true
    })
})

export type SchemaType = z.infer<typeof formSchema>

export const convertFormToFlashSale = (form: SchemaType) => {
  const result: TAddFlashSaleRequestParams | TUpdateFlashSaleRequestParams = {
    id: form.id ?? undefined,
    startTime: form.startTime,
    endTime: form.endTime,
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
        images: item.images?.map((image) => ({
          name: image.name ?? image.fileUrl,
          fileUrl: image.fileUrl
        })),
        type: item.type,
        originalClassification: item.id,
        color: item.color,
        size: item.size,
        other: item.other
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
        images: item.images?.map((image) => ({
          name: image.name ?? image.fileUrl,
          fileUrl: image.fileUrl
        })),
        type: item.type,
        originalClassification: item.id,
        color: item.color,
        size: item.size,
        other: item.other
      }
    })) as SchemaType['productClassifications']
  }
}
