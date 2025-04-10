import { z } from 'zod'

import { defaultRequiredRegex } from '@/constants/regex'
import { TAddPreOderRequestParams, TUpdatePreOrderRequestParams } from '@/network/apis/pre-order/type'
import { ClassificationStatusEnum } from '@/types/classification'
import { FileStatusEnum, TFile } from '@/types/file'
import { TPreOrder } from '@/types/pre-order'
import { ProductClassificationTypeEnum } from '@/types/product'

// Extend TPreOrder to include images property if needed
interface ExtendedPreOrder extends TPreOrder {
  images?: TFile[]
}

// Extend request params to include images property
interface ExtendedPreOrderRequestParams extends TAddPreOderRequestParams {
  images?: TFile[]
}

interface ExtendedUpdatePreOrderRequestParams extends TUpdatePreOrderRequestParams {
  images?: TFile[]
}

export const formSchema = z
  .object({
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
                name: z.string(),
                fileUrl: z.string(),
                id: z.string().optional(),
                status: z.nativeEnum(FileStatusEnum).optional()
              })
            )
            .optional(),
          type: z.nativeEnum(ProductClassificationTypeEnum).optional(),
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
          id: z.string().optional(),
          rawClassification: z
            .object(
              {
                id: z.string().optional(),
                title: z
                  .string({
                    message: defaultRequiredRegex.message()
                  })
                  .optional(),
                price: z.coerce
                  .number({
                    message: defaultRequiredRegex.message()
                  })
                  .positive({ message: defaultRequiredRegex.message() }),
                quantity: z.coerce.number().int().positive({ message: defaultRequiredRegex.message() }),
                sku: z.string(),
                images: z.array(
                  z.object({
                    name: z.string(),
                    fileUrl: z.string(),
                    id: z.string().optional(),
                    status: z.nativeEnum(FileStatusEnum).optional()
                  })
                ),
                type: z.nativeEnum(ProductClassificationTypeEnum),
                color: z.string().optional().nullable(),
                size: z.string().optional().nullable(),
                other: z.string().optional().nullable()
              },
              {
                message: defaultRequiredRegex.message()
              }
            )
            .partial()
            .optional(),
          append: z
            .object({
              color: z.string().optional(),
              size: z.string().optional(),
              other: z.string().optional(),
              quantity: z.coerce
                .number({
                  message: defaultRequiredRegex.message()
                })
                .positive({ message: defaultRequiredRegex.message() }),
              sku: z.string({ message: defaultRequiredRegex.message() }),
              type: z.nativeEnum(ProductClassificationTypeEnum),
              images: z.array(
                z.object({
                  id: z.string().optional(),
                  name: z.string(),
                  fileUrl: z.string(),
                  status: z.nativeEnum(FileStatusEnum).optional()
                })
              ),
              title: z.string().optional(),
              price: z.coerce
                .number({
                  message: defaultRequiredRegex.message()
                })
                .positive({ message: defaultRequiredRegex.message() })
            })
            .superRefine((data, ctx) => {
              if (!data.color && !data.size && !data.other) {
                ctx.addIssue({
                  code: 'custom',
                  message: 'Please fill out at least one of color, size, or other.',
                  path: ['color']
                })
              }
            })
        })
      )
      .nonempty({
        message: defaultRequiredRegex.message()
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

    const isDupplicateSku = data.productClassifications.findIndex((item, index) => {
      return data.productClassifications.findIndex((i) => i.append.sku === item.append.sku) !== index
    })
    if (isDupplicateSku !== -1) {
      return ctx.addIssue({
        code: 'custom',
        message: 'SKU is duplicated',
        path: ['productClassifications', isDupplicateSku, 'append', 'sku']
      })
    }
  })

export type SchemaType = z.infer<typeof formSchema>

export const convertFormToPreProduct = (form: SchemaType) => {
  const initialClassifications = form.initialClassifications || []
  const currentClassifications = form.productClassifications || []

  // Process all classifications from all sources
  const processedClassifications = []

  // 1. Process modified and deleted classifications from initialClassifications
  for (const initialItem of initialClassifications) {
    if (!initialItem.id) continue

    // Check if this item still exists in current classifications (by ID)
    const existingItem = currentClassifications.find((current) => current.rawClassification?.id === initialItem.id)

    if (existingItem) {
      // Case 1: Item exists in both - it was modified
      // Merge initial with the modified values and append
      processedClassifications.push({
        ...initialItem, // Initial values
        // Updated values from append
        ...existingItem.append
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
    // If this item has no raw classification data or no id, it's a new item
    if (!currentItem.rawClassification?.id) {
      processedClassifications.push({
        ...currentItem.rawClassification,
        ...currentItem.append
      })
      continue
    }

    // Check if this item is new (doesn't exist in initial by ID)
    const existsInInitial = initialClassifications.some((initial) => initial.id === currentItem.rawClassification?.id)

    if (!existsInInitial) {
      // Case 3: Item in current but not in initial - it's new
      processedClassifications.push({
        ...currentItem.rawClassification,
        ...currentItem.append
      })
    }
  }

  const result: ExtendedPreOrderRequestParams | ExtendedUpdatePreOrderRequestParams = {
    id: form.id ?? undefined,
    startTime: form.startTime,
    endTime: form.endTime,
    productClassifications: processedClassifications,
    product: form.product,
    images: form.images
  }

  return result
}

export const convertPreProductToForm = (preProduct: ExtendedPreOrder): SchemaType => {
  return {
    id: preProduct.id,
    product: preProduct.product.id,
    startTime: preProduct.startTime,
    endTime: preProduct.endTime,
    images: preProduct.images?.map((image: TFile) => ({
      name: image.name || image.fileUrl || '',
      fileUrl: image.fileUrl,
      id: image.id,
      status: image.status
    })),
    initialClassifications: preProduct.productClassifications.map((item) => ({
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
      other: item.other,
      status: item.status,
      isAvailable: item.isAvailable
    })),
    productClassifications: preProduct.productClassifications.map((item) => ({
      id: item.id,
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
        sku: item.sku ?? '',
        title: item.title,
        price: item.price,
        type: item.type,
        images: item.images?.map((image) => ({
          id: image.id,
          name: image.name ?? image.fileUrl,
          fileUrl: image.fileUrl,
          status: image.status
        })),
        quantity: item.quantity,
        color: item.color ?? '',
        size: item.size ?? '',
        other: item.other ?? ''
      }
    })) as SchemaType['productClassifications']
  }
}
