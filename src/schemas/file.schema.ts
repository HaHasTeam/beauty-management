import { z } from 'zod'

import { FileStatusEnum } from '@/types/file'

export const FileSchema = z.object({
  fileUrl: z.string(),
  name: z.string().optional(),
  id: z.string().optional(),
  status: z.nativeEnum(FileStatusEnum).optional()
})

export type IFileSchema = z.infer<typeof FileSchema>
