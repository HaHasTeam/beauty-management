import { z } from 'zod'

import { defaultRequiredRegex } from '@/constants/regex'
import {
  AddConsultantServiceRequestParams,
  UpdateConsultantServiceByIdRequestParams
} from '@/network/apis/consultant-service/type'
import {
  ConsultantServiceTypeEnum,
  IConsultantService,
  ServiceBookingFormQuestionStatusEnum,
  ServiceBookingFormStatusEnum
} from '@/types/consultant-service'
import { FileStatusEnum } from '@/types/file'

export type FormType = Pick<IConsultantService, 'price' | 'serviceBookingFormData' | 'images' | 'description'> & {
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
        message: defaultRequiredRegex.message()
      })
      .min(1, {
        message: defaultRequiredRegex.message()
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
      message: defaultRequiredRegex.message()
    }),
    answers: optionSchema.array().optional().nullable(),
    // .transform((val) => {
    //   const obj: { [key: string]: string } = {}
    //   val?.forEach((item, index) => {
    //     const key = String.fromCharCode(65 + index) // 65 is the char code for 'A'
    //     obj[key] = item.label
    //   })
    //   return obj
    // }),
    status: z.nativeEnum(ServiceBookingFormQuestionStatusEnum).optional()
  })
  .superRefine((data, ctx) => {
    if (
      data.type === ConsultantServiceTypeEnum.SingleChoice ||
      data.type === ConsultantServiceTypeEnum.MultipleChoice
    ) {
      if (!data.answers || Object.keys(data.answers).length < 1) {
        return ctx.addIssue({
          message: defaultRequiredRegex.message(),
          code: 'custom',
          path: ['answers']
        })
      }
    }
  })

export type QuestionType = z.infer<typeof consultantServiceTypeSchema>

export const formSchema = z.object({
  id: z.string().optional(),
  description: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message()),
  price: z.coerce
    .number({
      message: defaultRequiredRegex.message()
    })
    .nonnegative({
      message: defaultRequiredRegex.message()
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
      message: defaultRequiredRegex.message()
    })
    .superRefine((data, ctx) => {
      const activeImages = data.filter((image) => image.status !== FileStatusEnum.INACTIVE)
      if (activeImages.length === 0) {
        ctx.addIssue({ message: defaultRequiredRegex.message(), code: 'custom', path: [] })
      }
    }),
  systemService: z
    .string({
      message: defaultRequiredRegex.message()
    })
    .min(1, {
      message: defaultRequiredRegex.message()
    }),
  serviceBookingFormData: z.object({
    id: z.string().optional(),
    title: z
      .string({
        message: defaultRequiredRegex.message(),
        required_error: defaultRequiredRegex.message()
      })
      .min(1, {
        message: defaultRequiredRegex.message()
      }),
    questions: z.array(consultantServiceTypeSchema),
    status: z.nativeEnum(ServiceBookingFormStatusEnum).optional()
  }),
  initialServiceBookingFormData: z
    .object({
      id: z.string().optional(),
      title: z.string().optional(),
      questions: z.array(consultantServiceTypeSchema).optional(),
      status: z.nativeEnum(ServiceBookingFormStatusEnum).optional()
    })
    .optional()
})

export type SchemaType = z.infer<typeof formSchema>

export const convertConsultantServiceToForm = (data: IConsultantService): FormType => {
  return {
    id: data?.id,
    price: data.price,
    description: data.description,
    images: data.images.filter((image) => image.status !== FileStatusEnum.INACTIVE),
    systemService: data.systemService.id,
    initialServiceBookingFormData: {
      status: data.serviceBookingForm?.status,
      id: data.serviceBookingForm?.id,
      title: data.serviceBookingForm.title,
      questions: data.serviceBookingForm.questions.map((question) => {
        return {
          id: question?.id,
          status: question.status,
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
    },
    serviceBookingFormData: {
      id: data.serviceBookingForm?.id,
      title: data.serviceBookingForm.title,
      status: data.serviceBookingForm.status,
      questions: data.serviceBookingForm.questions.map((question) => {
        return {
          id: question?.id,
          status: question.status,
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

export const convertFormToService = (
  formData: SchemaType
): UpdateConsultantServiceByIdRequestParams | AddConsultantServiceRequestParams => {
  // Xử lý questions - so sánh giữa serviceBookingFormData và initialServiceBookingFormData

  // 1. Lấy danh sách câu hỏi từ initialServiceBookingFormData (nếu có)
  const initialQuestions = formData.initialServiceBookingFormData?.questions || []

  // 2. Lấy danh sách câu hỏi hiện tại từ serviceBookingFormData
  const currentQuestions = formData.serviceBookingFormData.questions || []

  // 3. Tạo danh sách kết quả cuối cùng
  const finalQuestions: QuestionType[] = []

  // Đối với các câu hỏi trong initialServiceBookingFormData
  initialQuestions.forEach((initialQuestion) => {
    if (initialQuestion.id) {
      // Tìm xem câu hỏi này còn tồn tại trong currentQuestions không
      const currentQuestionIndex = currentQuestions.findIndex((q) => q.id === initialQuestion.id)

      if (currentQuestionIndex >= 0) {
        // Trường hợp: Câu hỏi có ở cả initial và current => Update từ current
        finalQuestions.push(currentQuestions[currentQuestionIndex])
      } else {
        // Trường hợp: Câu hỏi có ở initial nhưng không có ở current => Đánh dấu INACTIVE
        finalQuestions.push({
          ...initialQuestion,
          status: ServiceBookingFormQuestionStatusEnum.INACTIVE
        })
      }
    }
  })

  // Thêm các câu hỏi mới từ currentQuestions (không có trong initialQuestions)
  currentQuestions.forEach((currentQuestion) => {
    // Nếu là câu hỏi mới (không có id hoặc id không có trong initialQuestions)
    const isNewQuestion = !currentQuestion.id || !initialQuestions.some((q) => q.id === currentQuestion.id)

    if (isNewQuestion) {
      // Trường hợp: Câu hỏi mới, chỉ có trong current => Thêm mới
      finalQuestions.push({
        ...currentQuestion,
        status: ServiceBookingFormQuestionStatusEnum.ACTIVE
      })
    }
  })

  // Sắp xếp lại thứ tự nếu cần
  finalQuestions.forEach((question, index) => {
    question.orderIndex = index + 1
  })

  // Xử lý answers cho mỗi câu hỏi
  const processedQuestions = finalQuestions.map((question) => {
    // Chuyển đổi answers từ mảng về đối tượng nếu cần
    let processedAnswers: { [key: string]: string } | undefined = undefined

    if (Array.isArray(question.answers)) {
      processedAnswers = {}
      question.answers.forEach((answer, index) => {
        if (answer) {
          const key = answer.value || String.fromCharCode(65 + index) // A, B, C, ...
          processedAnswers![key] = answer.label
        }
      })
    } else {
      processedAnswers = question.answers || {}
    }

    return {
      id: question.id,
      question: question.question,
      orderIndex: question.orderIndex || 0,
      mandatory: question.mandatory || false,
      type: question.type,
      images: question.images || [],
      answers: processedAnswers,
      status: question.status || ServiceBookingFormQuestionStatusEnum.ACTIVE
    }
  })

  // Tạo đối tượng kết quả
  return {
    id: formData.id,
    description: formData.description,
    price: formData.price,
    images: formData.images,
    systemService: formData.systemService,
    serviceBookingFormData: {
      id: formData.serviceBookingFormData.id,
      title: formData.serviceBookingFormData.title,
      status: formData.serviceBookingFormData.status || ServiceBookingFormStatusEnum.ACTIVE,
      questions: processedQuestions
    }
  } as UpdateConsultantServiceByIdRequestParams | AddConsultantServiceRequestParams
}
