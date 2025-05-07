import { StatusEnum } from './enum'
import { TServerFile } from './file'
import { TMetaData } from './request'

export interface IMasterConfig extends TMetaData {
  name: string
  logo: string
  maxLevelCategory: number
  commissionFee: string
  groupBuyingRemainingTime: number
  autoCancelOrderTime: string
  autoCompleteOrderTime: string
  autoApproveRefundRequestTime: string
  feedbackTimeExpired: string
  refundTimeExpired: string
  maximumUpdateBrandProfileTime: number
  complaintTimeExpired: number
  autoUpdateOrderToRefundedStatusTime: string
  expiredReceivedTime: string
  status: StatusEnum
  banners: TServerFile[]
  expiredCustomerReceivedTime: string // fe add
  pendingAdminCheckRejectRefundRequestTime: string // fe add
  pendingAdminCheckComplaintRequestTime: string // fe add
  pendingCustomerShippingReturnTime: string // fe add
  maxFeedbackImages: number
  maxFeedbackVideos: number
  maxFeedbackSize: string
  maxProductImages: number
  maxProductClassificationImages: number
  amountProductWarning: number
  maxEvidenceImages: number
  maxEvidenceVideos: number
  maxEvidenceSize: string
  requestReturnOrderMaxImages: number
  requestReturnOrderMaxVideos: number
  requestReturnOrderMaxSize: string
  expiredBookingToPay: string
  expiredBookingWaitForConfirm: string
  expiredBookingConfirmed: string
  expiredBookinFormSubmited: string
  expiredBookinCompletedCall: string
}
