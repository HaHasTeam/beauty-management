import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@/components/button'
import { AlertDescription } from '@/components/ui/alert'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import {
  getCancelAndReturnRequestApi,
  getOrderByIdApi,
  getStatusTrackingByIdApi,
  makeDecisionOnRejectReturnRequestOrderApi
} from '@/network/apis/order'
import { RequestStatusEnum } from '@/types/enum'
import { IRejectReturnRequestOrder, IReturnRequestOrder } from '@/types/order'

import ConfirmDecisionDialog from './ConfirmDecisionDialog'

const MakeDecisionOnReturnRejectRequest = ({
  rejectReturnRequest,
  refundRequest,
  pendingAdminCheckRejectRefundRequestTime
}: {
  refundRequest: IReturnRequestOrder
  rejectReturnRequest: IRejectReturnRequestOrder | null
  pendingAdminCheckRejectRefundRequestTime: number
}) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false)
  const [isLoadingDecisionApproved, setIsLoadingDecisionApproved] = useState<boolean>(false)
  const [isLoadingDecisionRejected, setIsLoadingDecisionRejected] = useState<boolean>(false)

  const { mutateAsync: makeDecisionOnRejectReturnRequestOrderFn } = useMutation({
    mutationKey: [makeDecisionOnRejectReturnRequestOrderApi.mutationKey],
    mutationFn: makeDecisionOnRejectReturnRequestOrderApi.fn,
    onSuccess: () => {
      successToast({
        message: t('return.successMakeDecisionOnReject'),
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

  const handleMakeDecisionOnReturnRejectRequest = async (decision: RequestStatusEnum) => {
    try {
      if (decision === RequestStatusEnum.APPROVED) {
        setIsLoadingDecisionApproved(true)
      } else {
        setIsLoadingDecisionRejected(true)
      }
      await makeDecisionOnRejectReturnRequestOrderFn({
        requestId: rejectReturnRequest?.id ?? '',
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
  if (!rejectReturnRequest) return null
  return (
    rejectReturnRequest && (
      <div className={`bg-yellow-50 rounded-lg p-3 border border-yellow-300`}>
        <div className='flex items-center gap-2 justify-between'>
          <div className='flex items-center gap-2'>
            <div className='flex flex-col gap-1'>
              <div>
                <h3 className={`sm:text-base text-xs rounded-full uppercase cursor-default font-bold text-yellow-500`}>
                  {t('return.rejectReturnRequestPendingTitle')}
                </h3>
              </div>
              <AlertDescription>
                {t('return.returnOrderRequestMessage', { count: pendingAdminCheckRejectRefundRequestTime })}
              </AlertDescription>
            </div>
          </div>
          <div className='flex gap-2 items-center'>
            <div className='flex gap-2 items-center'>
              <Button
                variant='outline'
                className='w-full bg-yellow-500 hover:bg-yellow-600 text-white hover:text-white'
                onClick={() => setOpenConfirmDialog(true)}
              >
                {t('button.view')}
              </Button>
            </div>
          </div>
        </div>
        <ConfirmDecisionDialog
          isLoadingDecisionApproved={isLoadingDecisionApproved}
          isLoadingDecisionRejected={isLoadingDecisionRejected}
          open={openConfirmDialog}
          onOpenChange={setOpenConfirmDialog}
          onConfirm={() => handleMakeDecisionOnReturnRejectRequest(RequestStatusEnum.APPROVED)}
          item={'decisionRejectReturn'}
          isShowAction
          rejectReason={rejectReturnRequest.reason}
          rejectMediaFiles={rejectReturnRequest.mediaFiles}
          reason={refundRequest.reason}
          mediaFiles={refundRequest.mediaFiles}
          returnRequest={refundRequest}
          isRejectRequest
          status={refundRequest?.status}
          rejectRequestId={rejectReturnRequest.id}
        />
      </div>
    )
  )
}

export default MakeDecisionOnReturnRejectRequest
