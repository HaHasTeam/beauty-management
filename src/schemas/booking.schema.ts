import i18next from 'i18next'
import { z } from 'zod'

import { ConsultantServiceTypeEnum } from '@/types/consultant-service'

export const getImageSchema = () => {
  return z.object({
    name: z.string().min(1, i18next.t('validation.required')),
    fileUrl: z.string().min(1, i18next.t('validation.required'))
  })
}
export const ImageSchema = getImageSchema()

export const getQuestionSchema = () => {
  return z.object({
    question: z.string().min(1, i18next.t('validation.required')),
    orderIndex: z.number().int().min(0),
    mandatory: z.boolean(),
    images: z.array(ImageSchema).optional(),
    answers: z.record(z.string(), z.string()),
    type: z.enum([
      ConsultantServiceTypeEnum.SingleChoice,
      ConsultantServiceTypeEnum.MultipleChoice,
      ConsultantServiceTypeEnum.Text
    ])
  })
}

export const QuestionSchema = getQuestionSchema()

export const getAnswerSchema = () => {
  return z.object({
    question: z.string().min(1, i18next.t('validation.required')),
    orderIndex: z.number().int().min(0),
    answers: z.record(z.string(), z.string()).refine((val) => Object.keys(val).length > 0, {
      message: i18next.t('validation.required')
    }),
    images: z.array(ImageSchema).optional()
  })
}

export const AnswerSchema = getAnswerSchema()

export const getBookingFormAnswerSchema = () => {
  return z.object({
    formId: z.string(),
    form: z.array(QuestionSchema),
    answers: z.array(AnswerSchema)
  })
}

export const getCriteriaSchema = () => {
  return z.object({
    section: z.string().min(1, i18next.t('validation.required')),
    orderIndex: z.number().int().min(0)
  })
}

export const CriteriaSchema = getCriteriaSchema()

export const getResultSchema = () => {
  return z.object({
    section: z.string().min(1, i18next.t('validation.required')),
    orderIndex: z.number().int().min(0),
    answers: z.string().min(1, i18next.t('validation.required')),
    images: z.array(ImageSchema).optional()
  })
}

export const ResultSchema = getResultSchema()

export const getProductClassificationSchema = () => {
  return z.object({
    productClassificationId: z.string(),
    name: z.string().min(1, i18next.t('validation.required'))
  })
}

export const ProductClassificationSchema = getProductClassificationSchema()

export const getConsultationResultSchema = () => {
  return z.object({
    criteriaId: z.string(),
    criteria: z.array(
      z.object({
        section: z.string().min(1, i18next.t('validation.required')),
        orderIndex: z.number().int().min(0)
      })
    ),
    results: z.array(
      z.object({
        section: z.string().min(1, i18next.t('validation.required')),
        orderIndex: z.number().int().min(0),
        answers: z.string().min(1, i18next.t('validation.required')),
        images: z.array(z.instanceof(File)).optional()
      })
    ),
    suggestedProductClassifications: z.array(
      z.object({
        productClassificationId: z.string(),
        name: z.string().min(1, i18next.t('validation.required'))
      })
    )
  })
}
export const getConsultationResultWithImageSchema = () => {
  return z.object({
    criteriaId: z.string(),
    criteria: z.array(
      z.object({
        section: z.string().min(1, i18next.t('validation.required')),
        orderIndex: z.number().int().min(0)
      })
    ),
    results: z.array(
      z.object({
        section: z.string().min(1, i18next.t('validation.required')),
        orderIndex: z.number().int().min(0),
        answers: z.string().min(1, i18next.t('validation.required')),
        images: z.array(ImageSchema).optional()
      })
    ),
    suggestedProductClassifications: z.array(
      z.object({
        productClassificationId: z.string(),
        name: z.string().min(1, i18next.t('validation.required'))
      })
    )
  })
}
export const ConsultationResultSchema = getConsultationResultSchema()
export const ConsultationResultWithImageSchema = getConsultationResultWithImageSchema()

export const BookingFormAnswerSchema = getBookingFormAnswerSchema()

export const getCompleteConsultingCallSchema = () => {
  return z.object({
    resultNote: z.string(),
    images: z
      .array(z.instanceof(File))
      .min(1, { message: i18next.t('validation.required') })
      .max(3),
    videos: z
      .array(z.instanceof(File))
      .min(1, { message: i18next.t('validation.required') })
      .max(2),
    mediaFiles: z.array(z.string()).optional()
  })
}
