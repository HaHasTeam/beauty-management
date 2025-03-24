import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@/components/button'
import LoadingIcon from '@/components/loading-icon'
import { AlertDescription } from '@/components/ui/alert'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import {
  getCancelAndReturnRequestApi,
  getOrderByIdApi,
  getStatusTrackingByIdApi,
  makeDecisionOnCancelRequestOrderApi
} from '@/network/apis/order'
import { RequestStatusEnum } from '@/types/enum'
import { ICancelRequestOrder } from '@/types/order'

import ReasonDialog from './ReasonDialog'

const MakeDecisionOnCancelRequest = ({
  cancelOrderRequest,
  pendingRequestCancelTime
}: {
  cancelOrderRequest: ICancelRequestOrder | null
  pendingRequestCancelTime: number
}) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const [openReasonDialog, setOpenReasonDialog] = useState<boolean>(false)
  const [isLoadingDecisionApproved, setIsLoadingDecisionApproved] = useState<boolean>(false)
  const [isLoadingDecisionRejected, setIsLoadingDecisionRejected] = useState<boolean>(false)
  const reasons: { value: string }[] = useMemo(
    () => [
      { value: t('order.rejectCancelOrderReason.SHIPPED') },
      { value: t('order.rejectCancelOrderReason.PROCESSED') },
      { value: t('order.rejectCancelOrderReason.MULTIPLE_ATTEMPTS') },
      { value: t('order.rejectCancelOrderReason.SUSPICIOUS_ACTIVITY') },
      { value: t('order.cancelOrderReason.other') }
    ],
    [t]
  )

  const { mutateAsync: makeDecisionOnCancelRequestOrderFn } = useMutation({
    mutationKey: [makeDecisionOnCancelRequestOrderApi.mutationKey],
    mutationFn: makeDecisionOnCancelRequestOrderApi.fn,
    onSuccess: () => {
      successToast({
        message: t('order.processSuccess'),
        isShowDescription: false
      })
      queryClient.invalidateQueries({
        queryKey: [getOrderByIdApi.queryKey]
      })
      queryClient.invalidateQueries({
        queryKey: [getStatusTrackingByIdApi.queryKey]
      })
      queryClient.invalidateQueries({
        queryKey: [getCancelAndReturnRequestApi.queryKey]
      })
    }
  })

  const handleMakeDecisionOnCancelRequest = async (decision: RequestStatusEnum) => {
    try {
      if (decision === RequestStatusEnum.APPROVED) {
        setIsLoadingDecisionApproved(true)
      } else {
        setIsLoadingDecisionRejected(true)
      }
      await makeDecisionOnCancelRequestOrderFn({
        requestId: cancelOrderRequest?.id ?? '',
        status: decision,
        reasonRejected: ''
      })
      if (decision === RequestStatusEnum.APPROVED) {
        setIsLoadingDecisionApproved(false)
      } else {
        setIsLoadingDecisionRejected(false)
      }
    } catch (error) {
      if (decision === RequestStatusEnum.APPROVED) {
        setIsLoadingDecisionApproved(false)
      } else {
        setIsLoadingDecisionRejected(false)
      }
      handleServerError({
        error
      })
    }
  }
  const handleRejectOnCancelRequest = async (reason: string) => {
    try {
      setIsLoadingDecisionRejected(true)

      await makeDecisionOnCancelRequestOrderFn({
        requestId: cancelOrderRequest?.id ?? '',
        status: RequestStatusEnum.REJECTED,
        reasonRejected: reason
      })

      setOpenReasonDialog(false)
      setIsLoadingDecisionRejected(false)
    } catch (error) {
      setIsLoadingDecisionRejected(false)
      setOpenReasonDialog(false)
      handleServerError({
        error
      })
    }
  }

  if (!cancelOrderRequest) return null
  return (
    cancelOrderRequest && (
      <div className='w-full'>
        <div className={`bg-red-100 rounded-lg p-3 border border-red-300`}>
          <div className='flex items-center gap-2 justify-between'>
            <div className='flex items-center gap-2'>
              <div className='flex flex-col gap-1'>
                <div>
                  <h3
                    className={`sm:text-base text-xs rounded-full uppercase cursor-default font-bold bg-red-100 text-red-600`}
                  >
                    {t('order.cancelRequestPendingBrandTitle')}
                  </h3>
                </div>
                <AlertDescription>
                  {t('order.CancelOrderRequestBrandMessage', { count: pendingRequestCancelTime })}
                </AlertDescription>
              </div>
            </div>
            <div className='flex gap-2 items-center'>
              <div className='flex gap-2 items-center'>
                <Button
                  variant='outline'
                  className='w-full border text-destructive bg-white border-destructive hover:text-destructive hover:bg-destructive/10'
                  onClick={() => setOpenReasonDialog(true)}
                >
                  {isLoadingDecisionRejected ? <LoadingIcon color='primaryBackground' /> : t('button.rejected')}
                </Button>
                <Button
                  variant='default'
                  className='w-full border text-white bg-green-500 hover:text-white hover:bg-green-400'
                  onClick={() => handleMakeDecisionOnCancelRequest(RequestStatusEnum.APPROVED)}
                >
                  {isLoadingDecisionApproved ? <LoadingIcon /> : t('button.approved')}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <ReasonDialog
          onOpenChange={setOpenReasonDialog}
          open={openReasonDialog}
          reasons={reasons}
          setOpen={setOpenReasonDialog}
          onConfirm={handleRejectOnCancelRequest}
          item={'rejectCancel'}
          isLoading={isLoadingDecisionRejected}
        />
      </div>
    )
  )
}

export default MakeDecisionOnCancelRequest
