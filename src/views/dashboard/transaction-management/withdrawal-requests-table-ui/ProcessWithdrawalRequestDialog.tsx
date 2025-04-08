import { ArrowRight, Clock } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
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
import { TWithdrawalRequest } from '@/types/withdrawal-request'

interface ProcessWithdrawalRequestDialogProps {
  withdrawalRequests: TWithdrawalRequest[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  showTrigger?: boolean
  onSuccess?: () => void
}

export function ProcessWithdrawalRequestDialog({
  withdrawalRequests,
  open,
  onOpenChange,
  showTrigger = true,
  onSuccess
}: ProcessWithdrawalRequestDialogProps) {
  const { successToast, errorToast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleProcess = async () => {
    setLoading(true)
    try {
      // This would call an API in a real implementation
      // await Promise.all(
      //   withdrawalRequests.map((request) =>
      //     updateWithdrawalRequest({
      //       id: request.id,
      //       data: {
      //         status: WithdrawalStatusEnum.PROCESSING
      //       }
      //     })
      //   )
      // )

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      successToast({
        message: 'Withdrawal request marked as processing',
        description: `Successfully marked ${withdrawalRequests.length} withdrawal request(s) as processing.`
      })

      if (onSuccess) onSuccess()
      if (onOpenChange) onOpenChange(false)
    } catch {
      errorToast({
        message: 'Error',
        description: 'Failed to process the withdrawal request(s). Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  const content = (
    <DialogContent className='sm:max-w-md'>
      <DialogHeader>
        <DialogTitle>Process Withdrawal Request{withdrawalRequests.length > 1 ? 's' : ''}</DialogTitle>
        <DialogDescription>
          {withdrawalRequests.length === 1
            ? 'Are you sure you want to mark this withdrawal request as "Processing"? This indicates that you are actively working on this withdrawal.'
            : `Are you sure you want to mark these ${withdrawalRequests.length} withdrawal requests as "Processing"? This indicates that you are actively working on these withdrawals.`}
        </DialogDescription>
      </DialogHeader>
      <div className='py-2'>
        <div className='rounded-md bg-blue-50 p-4 mt-2'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <Clock className='h-5 w-5 text-blue-400' aria-hidden='true' />
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-blue-800'>Processing Information</h3>
              <div className='mt-2 text-sm text-blue-700'>
                <p>Moving a withdrawal request to "Processing" status means:</p>
                <ul className='list-disc pl-5 space-y-1 mt-2'>
                  <li>You are assigned as the processor of this request</li>
                  <li>You will be responsible for completing or rejecting it</li>
                  <li>The request will appear in your processing list</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type='button' variant='secondary' disabled={loading}>
            Cancel
          </Button>
        </DialogClose>
        <Button
          type='button'
          variant='default'
          className='bg-blue-600 hover:bg-blue-700 text-white'
          onClick={handleProcess}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Mark as Processing'}
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
          <ArrowRight className='h-3.5 w-3.5' />
          <span>Process</span>
        </Button>
      </DialogTrigger>
      {content}
    </Dialog>
  )
}
