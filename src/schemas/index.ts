import { z } from 'zod'

import { StatusEnum } from '@/types/enum'

const phoneRegex = new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/)
// const fileSchema = z.object({
//   path: z.string(),
//   relativePath: z.string(),

//   lastModified: z.number(),
//   lastModifiedDate: z.date(),
//   name: z.string(),
//   size: z.number(),

//   type: z.string(),
//   webkitRelativePath: z.string()
// })

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
