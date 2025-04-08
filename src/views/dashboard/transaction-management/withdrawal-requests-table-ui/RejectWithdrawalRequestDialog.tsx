import { useMutation, useQueryClient } from '@tanstack/react-query'
import { XCircle } from 'lucide-react'
import { useState } from 'react'

import Button from '@/components/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/useToast'
import { rejectWithdrawalRequest } from '@/network/apis/withdrawal-request'
import { TWithdrawalRequest } from '@/types/withdrawal-request'

// Predefined rejection reasons
const REJECTION_REASONS = [
  'Insufficient account information',
  'Invalid bank details',
  'Withdrawal amount exceeds available balance',
  'Suspicious activity detected',
  'Duplicate withdrawal request',
  'Other'
]

interface RejectWithdrawalRequestDialogProps {
  withdrawalRequests: TWithdrawalRequest[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  showTrigger?: boolean
  onSuccess?: () => void
}

export function RejectWithdrawalRequestDialog({
  withdrawalRequests,
  open,
  onOpenChange,
  showTrigger = true,
  onSuccess
}: RejectWithdrawalRequestDialogProps) {
  const { successToast, errorToast } = useToast()
  const [selectedReason, setSelectedReason] = useState<string>('')
  const [customReason, setCustomReason] = useState<string>('')
  const queryClient = useQueryClient()

  // Get the actual rejection reason based on selection
  const getReasonText = () => {
    if (selectedReason === 'Other') {
      return customReason.trim()
    }
    return selectedReason
  }

  // Use TanStack Query for API calls
  const { mutateAsync: rejectWithdrawalRequestFn, isPending } = useMutation({
    mutationKey: [rejectWithdrawalRequest.mutationKey],
    mutationFn: rejectWithdrawalRequest.fn,
    onSuccess: () => {
      successToast({
        message: 'Withdrawal request rejected successfully',
        description: 'The withdrawal request has been rejected successfully'
      })

      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: ['filterWithdrawalRequests']
      })

      if (onSuccess) onSuccess()
      if (onOpenChange) onOpenChange(false)
      setSelectedReason('')
      setCustomReason('')
    },
    onError: () => {
      errorToast({
        message: 'Error',
        description: 'Failed to reject the withdrawal request(s). Please try again.'
      })
    }
  })

  const handleReject = async () => {
    const reasonText = getReasonText()
    if (!reasonText) return

    try {
      // Process all withdrawal requests
      await Promise.all(
        withdrawalRequests.map((request) =>
          rejectWithdrawalRequestFn({
            id: request.id,
            rejectedReason: reasonText
          })
        )
      )
    } catch {
      // Error handling is done in the mutation
    }
  }

  // Check if form is valid for submission
  const isFormValid = () => {
    if (!selectedReason) return false
    if (selectedReason === 'Other' && !customReason.trim()) return false
    return true
  }

  const content = (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Reject Withdrawal Request{withdrawalRequests.length > 1 ? 's' : ''}</DialogTitle>
        <DialogDescription>
          {withdrawalRequests.length === 1
            ? 'Are you sure you want to reject this withdrawal request?'
            : `Are you sure you want to reject these ${withdrawalRequests.length} withdrawal requests?`}
        </DialogDescription>
      </DialogHeader>
      <div className='grid gap-4 py-4'>
        <div className='grid gap-2'>
          <Label htmlFor='reason'>Reason for Rejection</Label>
          <Select value={selectedReason} onValueChange={setSelectedReason}>
            <SelectTrigger>
              <SelectValue placeholder='Select a reason' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Common Reasons</SelectLabel>
                {REJECTION_REASONS.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {selectedReason === 'Other' && (
            <div className='mt-4'>
              <Label htmlFor='customReason'>Custom Reason</Label>
              <Textarea
                id='customReason'
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder='Please provide a detailed reason for rejection...'
                className='min-h-24 mt-2'
              />
            </div>
          )}
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type='button' variant='secondary' loading={isPending}>
            Cancel
          </Button>
        </DialogClose>
        <Button
          type='button'
          variant='destructive'
          onClick={handleReject}
          loading={isPending}
          disabled={!isFormValid()}
        >
          {isPending ? 'Rejecting...' : 'Reject'}
        </Button>
      </DialogFooter>
    </DialogContent>
  )

  if (!showTrigger) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {content}
      </Dialog>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='destructive' size='sm' className='gap-1'>
          <XCircle className='h-3.5 w-3.5' />
          <span>Reject</span>
        </Button>
      </DialogTrigger>
      {content}
    </Dialog>
  )
}
