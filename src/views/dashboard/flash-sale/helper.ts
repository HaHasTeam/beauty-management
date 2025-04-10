import { z } from 'zod'

import { defaultRequiredRegex } from '@/constants/regex'
import { TAddFlashSaleRequestParams, TUpdateFlashSaleRequestParams } from '@/network/apis/flash-sale/type'
import { ClassificationStatusEnum } from '@/types/classification'
import { FileStatusEnum } from '@/types/file'
import { FlashSaleStatusEnum, TFlashSale } from '@/types/flash-sale'
import { ProductClassificationTypeEnum } from '@/types/product'

export const formSchema = z.object({
  id: z.string().optional(),
  product: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message()),
  startTime: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message()),
  endTime: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message()),
  images: z
    .array(
      z.object({
        name: z.string(),
        fileUrl: z.string(),
        id: z.string().optional(),
        status: z.nativeEnum(FileStatusEnum).optional()
      })
    )
    .optional(),
  status: z.nativeEnum(FlashSaleStatusEnum).optional(),
  discount: z.coerce
    .number({
      message: defaultRequiredRegex.message()
    })
    .positive({
      message: defaultRequiredRegex.message()
    }),
  initialClassifications: z
    .array(
      z.object({
        id: z.string().optional(),
        title: z.string().optional(),
        price: z.coerce.number().optional(),
        quantity: z.coerce.number().int().optional(),
        sku: z.string().optional(),
        images: z
          .array(
            z.object({
              name: z.string().optional(),
              fileUrl: z.string(),
              id: z.string().optional(),
              status: z.nativeEnum(FileStatusEnum).optional()
            })
          )
          .optional(),
        type: z.nativeEnum(ProductClassificationTypeEnum).optional(),
        originalClassification: z
          .string()
          .regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message())
          .optional(),
        color: z.string().optional().nullable(),
        size: z.string().optional().nullable(),
        other: z.string().optional().nullable(),
        status: z.nativeEnum(ClassificationStatusEnum).optional(),
        isAvailable: z.boolean().optional()
      })
    )
    .default([]),
  productClassifications: z
    .array(
      z.object({
        rawClassification: z.object(
          {
            id: z.string().optional(),
            title: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message()),
            price: z.coerce.number().positive({ message: defaultRequiredRegex.message() }),
            quantity: z.coerce.number().int().nonnegative({ message: defaultRequiredRegex.message() }),
            sku: z.string().optional(),
            images: z.array(
              z.object({
                name: z.string().optional(),
                fileUrl: z.string(),
                id: z.string().optional(),
                status: z.nativeEnum(FileStatusEnum).optional()
              })
            ),
            type: z.nativeEnum(ProductClassificationTypeEnum),
            originalClassification: z.string().optional(),
            color: z.string().optional().nullable(),
            size: z.string().optional().nullable(),
            other: z.string().optional().nullable()
          },
          {
            message: defaultRequiredRegex.message()
          }
        ),
        append: z.object({
          quantity: z.coerce
            .number({
              message: defaultRequiredRegex.message()
            })
            .positive({ message: defaultRequiredRegex.message() })
        })
      })
    )
    .nonempty({
      message: defaultRequiredRegex.message()
    })
    .superRefine((value, ctx) => {
      const rawClassification = value ?? []

      for (let i = rawClassification.length - 1; i >= 0; i--) {
        const raw = rawClassification[i]

        // Skip undefined values
        if (!raw?.rawClassification?.originalClassification) continue

        const originalClassification = raw.rawClassification.originalClassification
        const lastIndex = rawClassification.findIndex((item, index) => {
          return (
            index !== i &&
            item?.rawClassification?.originalClassification &&
            item.rawClassification.originalClassification === originalClassification
          )
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
  const initialClassifications = form.initialClassifications || []
  const currentClassifications = form.productClassifications || []

  // Process all classifications from all sources
  const processedClassifications = []

  // 1. Process modified and deleted classifications from initialClassifications
  for (const initialItem of initialClassifications) {
    if (!initialItem.id) continue

    // Check if this item still exists in current classifications (by ID)
    const existingItem = currentClassifications.find(
      (current) =>
        current.rawClassification?.id === initialItem.id || current.rawClassification?.title === initialItem.title
    )

    if (existingItem) {
      // Case 1: Item exists in both - it was modified
      // Merge initial with the modified values and append
      processedClassifications.push({
        ...initialItem, // Initial values
        // ...existingItem.rawClassification, // Updated values
        ...existingItem.append // Additional properties
        // Preserve original classification reference
        // originalClassification: existingItem.rawClassification.originalClassification
      })
    } else {
      // Case 2: Item in initial but not in current - it was deleted
      // Mark the initial item as inactive
      processedClassifications.push({
        ...initialItem,
        status: ClassificationStatusEnum.INACTIVE,
        isAvailable: false
      })
    }
  }

  // 2. Find new classifications (exist in current but not in initial)
  for (const currentItem of currentClassifications) {
    const rawClass = currentItem.rawClassification
    if (!rawClass || !rawClass.originalClassification) continue

    // Check if this item is new (doesn't exist in initial by ID)
    const existsInInitial = initialClassifications.some(
      (initial) => initial.id === rawClass.id || initial.title === rawClass.title
    )

    if (!existsInInitial) {
      // Case 3: Item in current but not in initial - it's new
      const removeImgId = rawClass.images?.map((image) => {
        return {
          name: image.name ?? image.fileUrl ?? '',
          fileUrl: image.fileUrl ?? '',
          status: image.status as FileStatusEnum
        }
      })
      processedClassifications.push({
        ...rawClass,
        ...currentItem.append,
        images: removeImgId
      })
    }
  }

  const result: TAddFlashSaleRequestParams | TUpdateFlashSaleRequestParams = {
    id: form.id ?? undefined,
    startTime: form.startTime,
    endTime: form.endTime,
    discount: form.discount,
    productClassifications: processedClassifications,
    product: form.product,
    images: form.images,
    status: form.status
  }

  return result
}

export const convertFlashSaleToForm = (flashSale: TFlashSale): SchemaType => {
  return {
    id: flashSale.id,
    product: flashSale.product.id,
    startTime: flashSale.startTime,
    endTime: flashSale.endTime,
    images: flashSale.images?.map((image) => ({
      ...image,
      name: image.name || image.fileUrl || '',
      fileUrl: image.fileUrl,
      id: image.id,
      status: image.status
    })),
    status: flashSale.status,
    discount: flashSale.discount,
    initialClassifications: flashSale.productClassifications.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      sku: item.sku ?? '',
      images: item.images?.map((image) => ({
        ...image,
        name: image.name ?? image.fileUrl,
        fileUrl: image.fileUrl,
        id: image.id,
        status: image.status
      })),
      type: item.type,
      color: item.color,
      size: item.size,
      other: item.other,
      status: item.status,
      isAvailable: item.isAvailable
    })),
    productClassifications: flashSale.productClassifications.map((item) => ({
      rawClassification: {
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        sku: item.sku ?? '',
        images: item.images?.map((image) => ({
          name: image.name ?? image.fileUrl,
          fileUrl: image.fileUrl,
          id: image.id,
          status: image.status
        })),
        type: item.type,
        color: item.color,
        size: item.size,
        other: item.other
      },
      append: {
        quantity: item.quantity
      }
    })) as SchemaType['productClassifications']
  }
}
