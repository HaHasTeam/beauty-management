import { z } from 'zod'

import { defaultRequiredRegex, phoneRegex } from '@/constants/regex'
import { AddressEnum } from '@/types/enum'

const CreateAddressSchema = z.object({
  fullName: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  account: z.string().optional(),
  phone: z.string().refine(phoneRegex.pattern, phoneRegex.message),
  detailAddress: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  ward: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  district: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  province: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  fullAddress: z.string().optional(),
  notes: z.string().optional(),
  type: z.enum([AddressEnum?.HOME, AddressEnum?.OFFICE, AddressEnum.OTHER]).optional(),
  isDefault: z.boolean().optional()
})

export default CreateAddressSchema
