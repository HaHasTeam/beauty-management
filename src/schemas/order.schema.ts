import i18next from 'i18next'
import { z } from 'zod'

const ItemSchema = z.object({
  productClassificationId: z.string(),
  quantity: z.number().int()
})

const OrderSchema = z.object({
  shopVoucherId: z.string().optional(), // Optional
  // items: z.array(ItemSchema).min(1), // Must have at least one item
  items: z.array(ItemSchema).optional(), // Create items manually
  message: z.string().optional() // Optional message for brand
})
export const getCreateOrderSchema = () => {
  return z.object({
    orders: z.array(OrderSchema).min(1), // Must have at least one order
    addressId: z.string().uuid(), // Must be a valid UUID
    paymentMethod: z.string().min(1, i18next.t('validation.paymentRequired')), // string
    platformVoucherId: z.string().optional() // Optional UUID
  })
}

export const getCancelOrderSchema = () => {
  return z.object({
    reason: z.string().min(1, i18next.t('validation.reasonRequired')),
    otherReason: z.string()
  })
}
export const getUpdateOrderStatusSchema = () => {
  return z.object({
    status: z.string().min(1, i18next.t('validation.statusRequired')),
    mediaFiles: z.array(z.instanceof(File)).optional()
  })
}
export const getUpdateOrderStatusEvidenceSchema = () => {
  return z.object({
    status: z.string().min(1, i18next.t('validation.statusRequired')),
    videos: z.array(z.instanceof(File)).min(1, i18next.t('validation.required')),
    images: z.array(z.instanceof(File)).min(1, i18next.t('validation.required'))
  })
}

export const getRejectReturnOrderSchema = () => {
  return z.object({
    reason: z.string().min(1, i18next.t('validation.reasonRequired')),
    otherReason: z.string(),
    mediaFiles: z.array(z.instanceof(File)).optional(),
    videos: z.array(z.instanceof(File)).min(1, i18next.t('validation.videosRequired')),
    images: z.array(z.instanceof(File)).min(1, i18next.t('validation.imagesRequired'))
  })
}

export const CreateOrderSchema = getCreateOrderSchema()
export const UpdateOrderStatusSchema = getUpdateOrderStatusSchema()
export const CancelOrderSchema = getCancelOrderSchema()
export const ReturnOrderSchema = getRejectReturnOrderSchema()
