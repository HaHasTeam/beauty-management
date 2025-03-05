import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@/components/button'
import { AlertDescription } from '@/components/ui/alert'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import {
  getBrandReturnRequestApi,
  getOrderByIdApi,
  getStatusTrackingByIdApi,
  makeDecisionOnReturnRequestOrderApi
} from '@/network/apis/order'
import { RequestStatusEnum } from '@/types/enum'
import { IOrderItem, IReturnRequestOrder } from '@/types/order'

import ConfirmDecisionDialog from './ConfirmDecisionDialog'

const MakeDecisionOnReturnRequest = ({ order }: { order: IOrderItem }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const [isTriggerReturnRequest, setIsTriggerReturnRequest] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false)
  const [isLoadingDecisionApproved, setIsLoadingDecisionApproved] = useState<boolean>(false)
  const [isLoadingDecisionRejected, setIsLoadingDecisionRejected] = useState<boolean>(false)
  const [returnRequests, setReturnRequests] = useState<IReturnRequestOrder[]>([])
  const { mutateAsync: getBrandReturnRequestOrderFn } = useMutation({
    mutationKey: [getBrandReturnRequestApi.mutationKey],
    mutationFn: getBrandReturnRequestApi.fn,
    onSuccess: (data) => {
      setReturnRequests(data?.data)
      setIsLoading(false)
    }
  })
  const { mutateAsync: makeDecisionOnReturnRequestOrderFn } = useMutation({
    mutationKey: [makeDecisionOnReturnRequestOrderApi.mutationKey],
    mutationFn: makeDecisionOnReturnRequestOrderApi.fn,
    onSuccess: () => {
      successToast({
        message: t('order.orderReturnlationUpdate')
      })
      queryClient.invalidateQueries({
        queryKey: [getOrderByIdApi.queryKey]
      })
      queryClient.invalidateQueries({
        queryKey: [getStatusTrackingByIdApi.queryKey]
      })
      setIsTriggerReturnRequest((prev) => !prev)
    }
  })
  useEffect(() => {
    const fetchReturnRequests = async () => {
      setIsLoading(true)
      const brandId =
        (
          order?.orderDetails?.[0]?.productClassification?.preOrderProduct ??
          order?.orderDetails?.[0]?.productClassification?.productDiscount ??
          order?.orderDetails?.[0]?.productClassification
        )?.product?.brand?.id ?? ''
      await getBrandReturnRequestOrderFn({
        brandId,
        data: {}
      })
    }
    fetchReturnRequests()
  }, [getBrandReturnRequestOrderFn, order?.orderDetails, isTriggerReturnRequest])

  const handleMakeDecisionOnReturnRequest = async (decision: RequestStatusEnum) => {
    try {
      if (decision === RequestStatusEnum.APPROVED) {
        setIsLoadingDecisionApproved(true)
      } else {
        setIsLoadingDecisionRejected(true)
      }
      await makeDecisionOnReturnRequestOrderFn({
        requestId:
          returnRequests?.find(
            (request) => request?.order?.id === order?.id && request.status === RequestStatusEnum.PENDING
          )?.id ?? '',
        status: decision,
        reasonRejected: ''
      })
      if (decision === RequestStatusEnum.APPROVED) {
        setIsLoadingDecisionApproved(false)
      } else {
        setIsLoadingDecisionRejected(false)
      }
    } catch (error) {
      setIsLoading(false)
      handleServerError({
        error
      })
    }
  }
  return (
    !isLoading &&
    returnRequests &&
    returnRequests?.length > 0 && (
      <div className={`bg-red-100 rounded-lg p-3 border border-red-300`}>
        <div className='flex items-center gap-2 justify-between'>
          <div className='flex items-center gap-2'>
            <div className='flex flex-col gap-1'>
              <div>
                <h3
                  className={`sm:text-base text-xs rounded-full uppercase cursor-default font-bold bg-red-100 text-red-600`}
                >
                  {t('order.returnRequestPendingTitle')}
                </h3>
              </div>
              <AlertDescription>{t('order.returnOrderRequestMessage')}</AlertDescription>
            </div>
          </div>
          <div className='flex gap-2 items-center'>
            <div className='flex gap-2 items-center'>
              <Button
                variant='outline'
                className='w-full bg-yellow-500 hover:bg-yellow-600'
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
          item={'decisionReturn'}
        />
      </div>
    )
  )
}

export default MakeDecisionOnReturnRequest
