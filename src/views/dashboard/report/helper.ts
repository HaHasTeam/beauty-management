import { z } from 'zod'

import { defaultRequiredRegex } from '@/constants/regex'
import { ConsultantServiceTypeEnum, IConsultantService } from '@/types/consultant-service'
import { FileStatusEnum } from '@/types/file'

export type FormType = Pick<IConsultantService, 'price' | 'serviceBookingFormData' | 'images'> & {
  systemService: string
}

const optionSchema = z.object({
  label: z.string(),
  value: z.string()
})

const consultantServiceTypeSchema = z
  .object({
    id: z.string().optional(),
    question: z
      .string({
        message: defaultRequiredRegex.message
      })
      .min(1, {
        message: defaultRequiredRegex.message
      }),
    orderIndex: z.number().optional(),
    mandatory: z.boolean(),
    images: z.array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        fileUrl: z.string(),
        status: z.nativeEnum(FileStatusEnum).optional()
      })
    ),
    type: z.nativeEnum(ConsultantServiceTypeEnum, {
      message: defaultRequiredRegex.message
    }),
    answers: optionSchema
      .array()
      .optional()
      .transform((val) => {
        const obj: { [key: string]: string } = {}
        val?.forEach((item, index) => {
          const key = String.fromCharCode(65 + index) // 65 is the char code for 'A'
          obj[key] = item.label
        })
        return obj
      })
  })
  .superRefine((data, ctx) => {
    if (
      data.type === ConsultantServiceTypeEnum.SingleChoice ||
      data.type === ConsultantServiceTypeEnum.MultipleChoice
    ) {
      if (!data.answers || Object.keys(data.answers).length < 1) {
        return ctx.addIssue({
          message: defaultRequiredRegex.message,
          code: 'custom',
          path: ['answers']
        })
      }
    }
  })

export const formSchema = z.object({
  id: z.string().optional(),
  price: z.coerce
    .number({
      message: defaultRequiredRegex.message
    })
    .nonnegative({
      message: defaultRequiredRegex.message
    }),
  images: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        fileUrl: z.string(),
        status: z.nativeEnum(FileStatusEnum).optional()
      })
    )
    .min(1, {
      message: defaultRequiredRegex.message
    }),
  systemService: z
    .string({
      message: defaultRequiredRegex.message
    })
    .min(1, {
      message: defaultRequiredRegex.message
    }),
  serviceBookingFormData: z.object({
    id: z.string().optional(),
    title: z
      .string({
        message: defaultRequiredRegex.message,
        required_error: defaultRequiredRegex.message
      })
      .min(1, {
        message: defaultRequiredRegex.message
      }),
    questions: z.array(consultantServiceTypeSchema)
  })
})

export type SchemaType = z.infer<typeof formSchema>

export const convertConsultantServiceToForm = (data: IConsultantService): FormType => {
  return {
    id: data?.id,
    price: data.price,
    images: data.images.filter((image) => image.status !== FileStatusEnum.INACTIVE),
    systemService: data.systemService.id,
    serviceBookingFormData: {
      id: data.serviceBookingForm?.id,
      title: data.serviceBookingForm.title,
      questions: data.serviceBookingForm.questions.map((question) => {
        return {
          id: question?.id,
          question: question.question,
          orderIndex: question.orderIndex,
          mandatory: question.mandatory,
          images: question.images.filter((image) => image.status !== FileStatusEnum.INACTIVE),
          type: question.type,
          answers: question.answers
            ? Object.keys(question.answers).map((key) => {
                if (question.answers) {
                  return {
                    label: String(question.answers[key as keyof typeof question.answers]),
                    value: key
                  }
                }
              })
            : null
        }
      })
    }
  } as FormType
}
