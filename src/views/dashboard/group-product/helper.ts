import * as z from 'zod'

import { defaultRequiredRegex, numberRequiredRegex } from '@/constants/regex'
import { TCreateGroupProductRequestParams, TUpdateGroupProductRequestParams } from '@/network/apis/group-product/type'
import { DiscountTypeEnum, VoucherApplyTypeEnum, VoucherVisibilityEnum } from '@/types/enum'
import { TGroupProduct } from '@/types/group-product'

export const formSchema = z.object({
  id: z.string().optional(),
  description: z.string().optional(),
  name: z
    .string({
      message: defaultRequiredRegex.message
    })
    .regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  productIds: z
    .array(
      z.string({
        message: defaultRequiredRegex.message
      }),
      {
        message: defaultRequiredRegex.message
      }
    )
    .nonempty({
      message: defaultRequiredRegex.message
    }),
  maxAmountOption: z
    .object({
      maxBuyAmountEachPerson: z.coerce
        .number()
        .int()
        .positive({
          message: numberRequiredRegex.message
        })
        .optional(),
      hasMaxBuyAmount: z.boolean().default(false)
    })
    .superRefine((maxAmountOption, ctx) => {
      if (maxAmountOption.hasMaxBuyAmount && !maxAmountOption.maxBuyAmountEachPerson) {
        ctx.addIssue({
          code: 'custom',
          message: defaultRequiredRegex.message,
          path: ['maxBuyAmountEachPerson']
        })
      }
    }),
  startTimeOption: z
    .object({
      hasStartTime: z.boolean().default(false),
      startTime: z.string().optional()
    })
    .superRefine((startTimeOption, ctx) => {
      if (startTimeOption.hasStartTime && !startTimeOption.startTime) {
        ctx.addIssue({
          code: 'custom',
          message: defaultRequiredRegex.message,
          path: ['startTime']
        })
      }
    }),
  endTimeOption: z
    .object({
      hasEndTime: z.boolean().default(false),
      endTime: z.string().optional()
    })
    .superRefine((endTimeOption, ctx) => {
      if (endTimeOption.hasEndTime && !endTimeOption.endTime) {
        ctx.addIssue({
          code: 'custom',
          message: defaultRequiredRegex.message,
          path: ['endTime']
        })
      }
    }),
  criterias: z
    .array(
      z.object({
        id: z.string().optional(),
        threshold: z.coerce
          .number({
            message: numberRequiredRegex.message
          })
          .int()
          .positive({
            message: numberRequiredRegex.message
          }),
        voucher: z.object({
          id: z.string().optional(),
          name: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
          applyType: z.nativeEnum(VoucherApplyTypeEnum).default(VoucherApplyTypeEnum.ALL),
          discountValue: z.coerce
            .number({
              message: numberRequiredRegex.message
            })
            .positive({
              message: numberRequiredRegex.message
            }),
          description: z.string().optional(),
          discountType: z.nativeEnum(DiscountTypeEnum),
          visibility: z.nativeEnum(VoucherVisibilityEnum).default(VoucherVisibilityEnum.GROUP),
          code: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message)
        })
      })
    )
    .nonempty({
      message: defaultRequiredRegex.message
    })
    .superRefine((criterias, ctx) => {
      const isIncreasing = criterias.every((criteria, index) => {
        if (index === 0) return true
        return criteria.threshold > criterias[index - 1].threshold
      })
      if (!isIncreasing) {
        const errorIndex = criterias.findIndex((criteria, index) => {
          if (index === 0) return false
          return criteria.threshold <= criterias[index - 1].threshold
        })
        ctx.addIssue({
          code: 'custom',
          message: 'The current quantity must be greater than the previous quantity',
          path: [`.${errorIndex}.threshold`]
        })
      }
    })
})

type GroupProductForm = z.infer<typeof formSchema>

export const convertFormToGroupProduct = (
  form: GroupProductForm & {
    brandId: string
  }
): TCreateGroupProductRequestParams | TUpdateGroupProductRequestParams => {
  const groupProduct: TCreateGroupProductRequestParams | TUpdateGroupProductRequestParams = {
    id: form.id,
    brandId: form.brandId,
    name: form.name,
    description: form.description,
    productIds: form.productIds,
    maxBuyAmountEachPerson: form.maxAmountOption.hasMaxBuyAmount
      ? form.maxAmountOption.maxBuyAmountEachPerson
      : undefined,
    startTime: form.startTimeOption.hasStartTime ? form.startTimeOption.startTime : undefined,
    endTime: form.endTimeOption.hasEndTime ? form.endTimeOption.endTime : undefined,
    criterias: form.criterias
  }

  return groupProduct
}

export const convertGroupProductToForm = (groupProduct: TGroupProduct): GroupProductForm => {
  return {
    id: groupProduct.id,
    name: groupProduct.name,
    description: groupProduct.description,
    productIds: groupProduct.products.map((product) => product.id) as GroupProductForm['productIds'],
    maxAmountOption: {
      hasMaxBuyAmount: !!groupProduct.maxBuyAmountEachPerson,
      maxBuyAmountEachPerson: groupProduct.maxBuyAmountEachPerson
    },
    startTimeOption: {
      hasStartTime: !!groupProduct.startTime,
      startTime: groupProduct.startTime
    },
    endTimeOption: {
      hasEndTime: !!groupProduct.endTime,
      endTime: groupProduct.endTime
    },
    criterias: groupProduct.criterias.map((criteria) => ({
      id: criteria.id,
      threshold: criteria.threshold,
      voucher: {
        name: criteria.voucher.name,
        applyType: criteria.voucher.applyType,
        discountValue: criteria.voucher.discountValue,
        description: criteria.voucher.description,
        discountType: criteria.voucher.discountType,
        visibility: criteria.voucher.visibility,
        code: criteria.voucher.code
      }
    })) as GroupProductForm['criterias']
  }
}
