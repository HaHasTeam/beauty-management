import { useState } from 'react'

import { TWithdrawalRequest, WithdrawalStatusEnum } from '@/types/withdrawal-request'

import { ApproveWithdrawalRequestDialog } from './ApproveWithdrawalRequestDialog'
import { CompletedWithdrawalRequestDialog } from './CompletedWithdrawalRequestDialog'
import { RejectWithdrawalRequestDialog } from './RejectWithdrawalRequestDialog'

interface WithdrawalRequestActionButtonsProps {
  withdrawalRequest: TWithdrawalRequest
  onSuccess?: () => void
}

export function WithdrawalRequestActionButtons({ withdrawalRequest, onSuccess }: WithdrawalRequestActionButtonsProps) {
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)

  const handleSuccess = () => {
    if (onSuccess) onSuccess()
  }

  // Render different action buttons based on status
  switch (withdrawalRequest.status) {
    case WithdrawalStatusEnum.PENDING:
      return (
        <div className='flex items-center gap-2'>
          <ApproveWithdrawalRequestDialog
            withdrawalRequests={[withdrawalRequest]}
            open={approveDialogOpen}
            onOpenChange={setApproveDialogOpen}
            onSuccess={handleSuccess}
          />
          <RejectWithdrawalRequestDialog
            withdrawalRequests={[withdrawalRequest]}
            open={rejectDialogOpen}
            onOpenChange={setRejectDialogOpen}
            onSuccess={handleSuccess}
          />
        </div>
      )

    case WithdrawalStatusEnum.APPROVED:
      return (
        <div className='flex items-center gap-2'>
          <CompletedWithdrawalRequestDialog
            withdrawalRequests={[withdrawalRequest]}
            open={completeDialogOpen}
            onOpenChange={setCompleteDialogOpen}
            onSuccess={handleSuccess}
          />
          <RejectWithdrawalRequestDialog
            withdrawalRequests={[withdrawalRequest]}
            open={rejectDialogOpen}
            onOpenChange={setRejectDialogOpen}
            onSuccess={handleSuccess}
          />
        </div>
      )

    case WithdrawalStatusEnum.COMPLETED:
    case WithdrawalStatusEnum.REJECTED:
    case WithdrawalStatusEnum.CANCELLED:
    default:
      // No actions available for completed, rejected, or cancelled requests
      return null
  }
}
