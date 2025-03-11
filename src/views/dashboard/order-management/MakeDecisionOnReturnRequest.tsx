import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'

import Button from '@/components/button'
import { AlertDescription } from '@/components/ui/alert'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import {
  getCancelAndReturnRequestApi,
  getOrderByIdApi,
  getStatusTrackingByIdApi,
  makeDecisionOnReturnRequestOrderApi
} from '@/network/apis/order'
import { useStore } from '@/stores/store'
import { RequestStatusEnum, RoleEnum } from '@/types/enum'
import { IReturnRequestOrder } from '@/types/order'

import ConfirmDecisionDialog from './ConfirmDecisionDialog'

const MakeDecisionOnReturnRequest = ({ returnRequest }: { returnRequest: IReturnRequestOrder | null }) => {
  const WAITING_DECISION_ON_REQUEST_RETURN_DAYS = 2
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false)
  const [isLoadingDecisionApproved, setIsLoadingDecisionApproved] = useState<boolean>(false)
  const [isLoadingDecisionRejected, setIsLoadingDecisionRejected] = useState<boolean>(false)

  const { user } = useStore(
    useShallow((state) => ({
      user: state.user
    }))
  )
  const { mutateAsync: makeDecisionOnReturnRequestOrderFn } = useMutation({
    mutationKey: [makeDecisionOnReturnRequestOrderApi.mutationKey],
    mutationFn: makeDecisionOnReturnRequestOrderApi.fn,
    onSuccess: () => {
      successToast({
        message: t('return.successMakeDecisionOnReturn')
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

  const handleMakeDecisionOnReturnRequest = async (decision: RequestStatusEnum) => {
    try {
      if (decision === RequestStatusEnum.APPROVED) {
        setIsLoadingDecisionApproved(true)
      } else {
        setIsLoadingDecisionRejected(true)
      }
      await makeDecisionOnReturnRequestOrderFn({
        requestId: returnRequest?.id ?? '',
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
  if (!returnRequest) return null
  return (
    returnRequest && (
      <div className={`bg-yellow-50 rounded-lg p-3 border border-yellow-300`}>
        <div className='flex items-center gap-2 justify-between'>
          <div className='flex items-center gap-2'>
            <div className='flex flex-col gap-1'>
              <div>
                <h3 className={`sm:text-base text-xs rounded-full uppercase cursor-default font-bold text-yellow-500`}>
                  {t('return.returnRequestPendingTitleBrand')}
                </h3>
              </div>
              <AlertDescription>
                {t('return.returnOrderRequestMessageBrand', { count: WAITING_DECISION_ON_REQUEST_RETURN_DAYS })}
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
          onConfirm={() => handleMakeDecisionOnReturnRequest(RequestStatusEnum.APPROVED)}
          item={user.role === RoleEnum.MANAGER || user.role === RoleEnum.STAFF ? 'viewReturn' : 'decisionReturn'}
          isShowAction={user?.role === RoleEnum.MANAGER || user?.role === RoleEnum.STAFF}
          reason={returnRequest.reason}
          mediaFiles={returnRequest.mediaFiles}
          returnRequest={returnRequest}
        />
      </div>
    )
  )
}

export default MakeDecisionOnReturnRequest
