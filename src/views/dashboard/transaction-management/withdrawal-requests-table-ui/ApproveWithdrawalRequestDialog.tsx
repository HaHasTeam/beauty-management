import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle } from 'lucide-react'

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
import { useToast } from '@/hooks/useToast'
import { approveWithdrawalRequest } from '@/network/apis/withdrawal-request'
import { TWithdrawalRequest } from '@/types/withdrawal-request'

interface ApproveWithdrawalRequestDialogProps {
  withdrawalRequests: TWithdrawalRequest[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  showTrigger?: boolean
  onSuccess?: () => void
}

export function ApproveWithdrawalRequestDialog({
  withdrawalRequests,
  open,
  onOpenChange,
  showTrigger = true,
  onSuccess
}: ApproveWithdrawalRequestDialogProps) {
  const { successToast, errorToast } = useToast()
  const queryClient = useQueryClient()

  // Use TanStack Query for API calls
  const { mutateAsync: approveWithdrawalRequestFn, isPending } = useMutation({
    mutationKey: [approveWithdrawalRequest.mutationKey],
    mutationFn: approveWithdrawalRequest.fn,
    onSuccess: () => {
      successToast({
        message: 'Withdrawal request approved',
        description: `Successfully marked ${withdrawalRequests.length} withdrawal request(s) as in progress.`
      })

      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: ['filterWithdrawalRequests']
      })

      if (onSuccess) onSuccess()
      if (onOpenChange) onOpenChange(false)
    },
    onError: () => {
      errorToast({
        message: 'Error',
        description: 'Failed to approve the withdrawal request(s). Please try again.'
      })
    }
  })

  const handleApprove = async () => {
    try {
      // Process all withdrawal requests
      await Promise.all(
        withdrawalRequests.map((request) =>
          approveWithdrawalRequestFn({
            id: request.id
          })
        )
      )
    } catch {
      // Error handling is done in the mutation
    }
  }

  const content = (
    <DialogContent className='sm:max-w-md'>
      <DialogHeader>
        <DialogTitle>Approve Withdrawal Request{withdrawalRequests.length > 1 ? 's' : ''}</DialogTitle>
        <DialogDescription>
          {withdrawalRequests.length === 1
            ? 'Are you sure you want to approve this withdrawal request? This will mark it as "Approved".'
            : `Are you sure you want to approve these ${withdrawalRequests.length} withdrawal requests? This will mark them as "Approved".`}
        </DialogDescription>
      </DialogHeader>
      <div className='rounded-md bg-blue-50 p-4 mt-2'>
        <div className='flex'>
          <div className='flex-shrink-0'>
            <CheckCircle className='h-5 w-5 text-blue-400' aria-hidden='true' />
          </div>
          <div className='ml-3'>
            <h3 className='text-sm font-medium text-blue-800'>What happens next?</h3>
            <div className='mt-2 text-sm text-blue-700'>
              <p>Approving a withdrawal request means:</p>
              <ul className='list-disc pl-5 space-y-1 mt-2'>
                <li>You are assigning yourself as the person responsible for processing this withdrawal</li>
                <li>The request status will change to "Approved"</li>
                <li>You will need to complete the withdrawal by providing evidence once the funds are transferred</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className='mt-4'>
        <DialogClose asChild>
          <Button type='button' variant='secondary' loading={isPending}>
            Cancel
          </Button>
        </DialogClose>
        <Button
          type='button'
          variant='default'
          loading={isPending}
          className='bg-blue-600 hover:bg-blue-700 text-white'
          onClick={handleApprove}
        >
          {isPending ? 'Approving...' : 'Approve & Process'}
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
        <Button
          variant='outline'
          size='sm'
          className='gap-1 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
        >
          <CheckCircle className='h-3.5 w-3.5' />
          <span>Approve</span>
        </Button>
      </DialogTrigger>
      {content}
    </Dialog>
  )
}
