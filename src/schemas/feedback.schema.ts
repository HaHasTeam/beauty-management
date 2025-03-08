import i18next from 'i18next'
import { z } from 'zod'

export const MIN_FEEDBACK_LENGTH = 25
export const MAX_FEEDBACK_LENGTH = 500
export const getReplyFeedbackSchema = () => {
  return z.object({
    content: z
      .string()
      .min(
        MIN_FEEDBACK_LENGTH,
        i18next.t('validation.contentReplyFeedback', { minLength: MIN_FEEDBACK_LENGTH, maxLength: MAX_FEEDBACK_LENGTH })
      )
      .max(
        MAX_FEEDBACK_LENGTH,
        i18next.t('validation.contentReplyFeedback', { minLength: MIN_FEEDBACK_LENGTH, maxLength: MAX_FEEDBACK_LENGTH })
      )
  })
}

export const ReplyFeedbackSchema = getReplyFeedbackSchema()
export type IReplyFeedbackSchema = z.infer<typeof ReplyFeedbackSchema>
