import { z } from 'zod'

import { defaultRequiredRegex, numberRequiredRegex } from '@/constants/regex'
import { DiscountTypeEnum, StatusEnum, VoucherEnum } from '@/types/enum'

const phoneRegex = new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/)

// Now add this object into an array
const fileArray = z.array(z.instanceof(File))
export const brandCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
  logo: fileArray.optional(),
  document: fileArray.min(1, 'You must upload at least 1 document for your license details'),
  description: z.string().max(255, 'Description cannot exceed 255 characters').optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(phoneRegex, 'Invalid phone number!').max(10).min(1).optional(),

  address: z.string().max(255, 'Address cannot exceed 255 characters').optional(),
  status: z.nativeEnum(StatusEnum).optional().default(StatusEnum.PENDING)
})

export const voucherCreateSchema = z.object({
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
  endTime: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  status: z.nativeEnum(StatusEnum).optional().default(StatusEnum.ACTIVE)
})
