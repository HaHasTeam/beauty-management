import { TFile } from './file'
import { TMetaData } from './request'
import { TUser } from './user'

/**
 * Status of withdrawal requests
 * Based on WithdrawalStatusEnum from the backend
 */
export enum WithdrawalStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

/**
 * File attached to withdrawal requests (evidences)
 */

/**
 * Withdrawal request entity
 * Maps to WithdrawalRequest entity from the backend
 */
export type TWithdrawalRequest = TMetaData & {
  /** Amount to withdraw */
  amount: number

  /** Current status of the withdrawal request */
  status: WithdrawalStatusEnum

  /** Bank name for the withdrawal */
  bankName: string

  /** Bank account number for the withdrawal */
  accountNumber: string

  /** Bank account holder name for the withdrawal */
  accountName: string

  /** User who requested the withdrawal */
  account: TUser

  /** Admin user who processed the withdrawal request (if processed) */
  processedBy?: TUser

  /** Reason provided when rejecting a withdrawal request */
  rejectedReason?: string

  /** Evidence files attached to the withdrawal request */
  evidences?: TFile[]
}
