import { z } from 'zod'

import { defaultRequiredRegex, numberRequiredRegex, phoneRegex } from '@/constants/regex'
import { DiscountTypeEnum, StatusEnum, VoucherApplyTypeEnum, VoucherEnum } from '@/types/enum'

// const phoneRegex = new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/)
export const reasonSchema = z.object({
  reason: z.string().min(1, 'Reason is required').max(200, 'Name cannot exceed 200 characters')
})
// Now add this object into an array
const fileArray = z.array(z.instanceof(File))
export const brandCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
  logo: fileArray.optional(),
  document: fileArray.min(1, 'You must upload at least 1 document for your license details'),
  description: z.string().max(255, 'Description cannot exceed 255 characters').optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(10).min(1).refine(phoneRegex.pattern, phoneRegex.message).optional(),

  address: z.string().max(255, 'Address cannot exceed 255 characters').optional(),
  province: z.string().max(255),
  district: z.string().max(255),
  ward: z.string().max(255),

  businessTaxCode: z.string().max(100),
  businessRegistrationCode: z.string().max(100),
  establishmentDate: z.string().max(255).optional(),
  businessRegistrationAddress: z.string().max(255).optional(),
  status: z.nativeEnum(StatusEnum).optional().default(StatusEnum.PENDING)
})

export const voucherCreateSchema = z.object({
  orderValueType: z.enum(['noLimit', 'limited']),
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
  code: z.string().min(1, 'Code is required').max(50, 'Code cannot exceed 50 characters'),
  type: z.nativeEnum(VoucherEnum).default(VoucherEnum.NORMAL),
  discountType: z.nativeEnum(DiscountTypeEnum),
  discountValue: z.coerce
    .number({
      message: numberRequiredRegex.message
    })
    .nonnegative('Discount Value must be non-negative'),
  maxDiscount: z.coerce
    .number({
      message: numberRequiredRegex.message
    })
    .int('Max Discount must be integer')
    .nonnegative('Max Discount must be non-negative')
    .optional(),
  minOrderValue: z.coerce
    .number({
      message: numberRequiredRegex.message
    })
    .int('Min Order Value must be integer')
    .nonnegative('Min Order Value must be non-negative')
    .optional(),
  description: z.string().max(255, 'Description cannot exceed 255 characters').optional(),
  amount: z.coerce
    .number({
      message: numberRequiredRegex.message
    })
    .int('Amount must be integer')
    .positive('Amount must be positive')
    .optional(),
  // startTime: z
  //   .string()
  //   .transform((str) => (str ? new Date(str) : undefined))
  //   .refine((date) => !date || date > new Date(), {
  //     message: 'Start Time must be greater than the current time.'
  //   }),
  // endTime: z
  //   .string()
  //   .transform((str) => (str ? new Date(str) : undefined))
  //   .refine((date) => !date || date > new Date(), {
  //     message: 'End Time must be greater than the current time.'
  //   }),
  startTime: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  applyType: z.nativeEnum(VoucherApplyTypeEnum).optional().default(VoucherApplyTypeEnum.ALL),
  endTime: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  status: z.nativeEnum(StatusEnum).optional().default(StatusEnum.ACTIVE),
  visibility: z.boolean().default(false).optional(),
  selectedProducts: z.array(z.string())
})

export const CreateAddressBrandSchema = z.object({
  detailAddress: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  ward: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  district: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  province: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  fullAddress: z.string().optional()
})
