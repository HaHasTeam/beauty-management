import { BaseParams } from '@/types/request'
import { WithdrawalStatusEnum } from '@/types/withdrawal-request'

/**
 * Parameters for creating a withdrawal request
 * Maps to CreateWithdrawalRequestSchema from the backend
 */
export type TCreateWithdrawalRequestParams = {
  /** Amount to withdraw (must be positive) */
  amount: number

  /** ID of the bank account to withdraw to */
  bankAccountId: string
}

/**
 * Parameters for updating a withdrawal request status
 * Maps to UpdateWithdrawalRequestSchema from the backend
 */
export type TUpdateWithdrawalRequestParams = {
  /** New status to set */
  status: WithdrawalStatusEnum

  /** Reason for rejection (required when status is REJECTED) */
  rejectedReason?: string

  /** Array of file IDs to attach as evidence */
  evidences?: string[]

  /** Transaction ID for completed withdrawals - optional since it may be provided by backend */
  transactionId?: string
}

/**
 * Parameters for filtering withdrawal requests
 * Maps to FilterWithdrawalRequestSchema from the backend
 */
export type TFilterWithdrawalRequestsParams = BaseParams<{
  /** Filter by one or more status values */
  statuses?: WithdrawalStatusEnum[]

  /** Filter by related account ID */
  relatedAccountId?: string

  /** Filter by requests after this date (ISO string) */
  startDate?: string

  /** Filter by requests before this date (ISO string) */
  endDate?: string

  /** Filter by minimum amount */
  minAmount?: number

  /** Filter by maximum amount */
  maxAmount?: number
}>
