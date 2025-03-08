import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { History, MessageSquareText, Truck } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import AlertMessage from '@/components/alert/AlertMessage'
import BrandSection from '@/components/branch/BrandSection'
import Button from '@/components/button'
import CancelOrderDialog from '@/components/dialog/CancelOrderDialog'
import UpdateOrderStatus from '@/components/dialog/UpdateOrderStatusDialog'
import Empty from '@/components/empty/Empty'
import LoadingIcon from '@/components/loading-icon'
import LoadingLayer from '@/components/loading-icon/LoadingLayer'
import OrderStatus from '@/components/order-status'
import { AlertDescription } from '@/components/ui/alert'
import { Routes, routesConfig } from '@/configs/routes'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import {
  getCancelAndReturnRequestApi,
  getOrderByIdApi,
  getRejectReturnRequestApi,
  getStatusTrackingByIdApi,
  makeDecisionOnCancelRequestOrderApi
} from '@/network/apis/order'
import { useStore } from '@/stores/store'
import { RequestStatusEnum, RoleEnum, ShippingStatusEnum } from '@/types/enum'

import MakeDecisionOnReturnRejectRequest from './MakeDecisionOnRejectReturnRequest'
import MakeDecisionOnReturnRequest from './MakeDecisionOnReturnRequest'
import OrderDetailItems from './order-detail/OrderDetailItems'
import OrderGeneral from './order-detail/OrderGeneral'
import OrderStatusTracking from './order-detail/OrderStatusTracking'
import OrderStatusTrackingDetail from './order-detail/OrderStatusTrackingDetail'
import OrderSummary from './order-detail/OrderSummary'

const OrderDetails = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const [openCancelOrderDialog, setOpenCancelOrderDialog] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingDecisionApproved, setIsLoadingDecisionApproved] = useState<boolean>(false)
  const [isLoadingDecisionRejected, setIsLoadingDecisionRejected] = useState<boolean>(false)

  const { user } = useStore(
    useShallow((state) => ({
      user: state.user
    }))
  )
  const { data: useOrderData, isFetching } = useQuery({
    queryKey: [getOrderByIdApi.queryKey, id as string],
    queryFn: getOrderByIdApi.fn,
    enabled: !!id,
    staleTime: 0
  })
  const { data: useStatusTrackingData, isFetching: isFetchingStatusTracking } = useQuery({
    queryKey: [getStatusTrackingByIdApi.queryKey, id ?? ('' as string)],
    queryFn: getStatusTrackingByIdApi.fn,
    enabled: !!id,
    staleTime: 0
  })

  const { data: cancelAndReturnRequestData } = useQuery({
    queryKey: [getCancelAndReturnRequestApi.queryKey, id ?? ('' as string)],
    queryFn: getCancelAndReturnRequestApi.fn,
    enabled: !!id
  })
  const { data: rejectReturnRequest } = useQuery({
    queryKey: [getRejectReturnRequestApi.queryKey, id ?? ('' as string)],
    queryFn: getRejectReturnRequestApi.fn,
    enabled: !!id
  })
  const { mutateAsync: makeDecisionOnCancelRequestOrderFn } = useMutation({
    mutationKey: [makeDecisionOnCancelRequestOrderApi.mutationKey],
    mutationFn: makeDecisionOnCancelRequestOrderApi.fn,
    onSuccess: () => {
      successToast({
        message: t('order.orderCancellationUpdate')
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
        requestId: cancelAndReturnRequestData?.data?.cancelOrderRequest?.id ?? '',
        status: decision
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
    <>
      {isFetching && <LoadingLayer />}
      <div className='w-full lg:px-5 md:px-4 sm:px-3 px-3 space-y-6 my-5'>
        <div className='flex gap-2 w-full sm:justify-between sm:items-center sm:flex-row flex-col'>
          <div className='flex gap-2 sm:items-center sm:flex-row flex-col'>
            <span className='text-lg text-muted-foreground font-medium'>{t('orderDetail.title')}</span>
            {!isFetching && useOrderData?.data && (
              <span className='text-lg text-muted-foreground'>#{useOrderData?.data?.id}</span>
            )}
          </div>
          {!isFetching && useOrderData?.data && (
            <div className='flex gap-2 items-center'>
              <span className='text-muted-foreground font-medium'>{t('orderDetail.status')}: </span>
              <OrderStatus tag={useOrderData?.data?.status ?? ''} size='medium' />
            </div>
          )}
        </div>

        {!isFetching && useOrderData && useOrderData?.data && (
          <>
            <div className='space-y-6 w-full'>
              {/* alert update order status */}
              {(user?.role === RoleEnum.MANAGER || user?.role === RoleEnum.STAFF) && (
                <UpdateOrderStatus order={useOrderData?.data} setOpenCancelOrderDialog={setOpenCancelOrderDialog} />
              )}
              {/* alert make decision request return order */}
              {/* brand */}
              {(user?.role === RoleEnum.MANAGER || user?.role === RoleEnum.STAFF) &&
                cancelAndReturnRequestData?.data?.refundRequest?.status === RequestStatusEnum.PENDING && (
                  <MakeDecisionOnReturnRequest
                    returnRequest={cancelAndReturnRequestData?.data?.refundRequest || null}
                  />
                )}
              {/* brand */}
              {/* alert make decision request reject return order */}
              {(user?.role === RoleEnum.MANAGER || user?.role === RoleEnum.STAFF) &&
                rejectReturnRequest?.data?.status === RequestStatusEnum.PENDING && (
                  <AlertMessage
                    title={t('return.rejectReturnRequestPendingTitleBrand')}
                    message={t('return.rejectReturnRequestPendingMessageBrand')}
                    isShowIcon={false}
                  />
                )}
              {(user?.role === RoleEnum.MANAGER || user?.role === RoleEnum.STAFF) &&
                rejectReturnRequest?.data?.status === RequestStatusEnum.APPROVED && (
                  <AlertMessage
                    title={t('return.rejectReturnRequestApprovedTitleBrand')}
                    message={t('return.rejectReturnRequestApprovedMessageBrand')}
                    isShowIcon={false}
                  />
                )}
              {(user?.role === RoleEnum.MANAGER || user?.role === RoleEnum.STAFF) &&
                rejectReturnRequest?.data?.status === RequestStatusEnum.REJECTED && (
                  <AlertMessage
                    title={t('return.rejectReturnRequestRejectedTitleBrand')}
                    message={t('return.rejectReturnRequestRejectedMessageBrand')}
                    isShowIcon={false}
                  />
                )}
              {/* admin */}
              {(user?.role === RoleEnum.ADMIN || user?.role === RoleEnum.OPERATOR) &&
                cancelAndReturnRequestData?.data?.refundRequest?.status === RequestStatusEnum.PENDING && (
                  <AlertMessage
                    title={t('return.returnRequestPendingTitleAdmin')}
                    message={t('return.returnRequestPendingMessageAdmin')}
                    isShowIcon={false}
                  />
                )}

              {/* alert make decision request reject return order */}
              {/* admin */}
              {(user?.role === RoleEnum.ADMIN || user?.role === RoleEnum.OPERATOR) &&
                rejectReturnRequest?.data?.status === RequestStatusEnum.PENDING &&
                cancelAndReturnRequestData?.data?.refundRequest && (
                  <MakeDecisionOnReturnRejectRequest
                    rejectReturnRequest={rejectReturnRequest?.data || null}
                    refundRequest={cancelAndReturnRequestData?.data?.refundRequest}
                  />
                )}

              {/* handle cancel request for brand and system role */}
              {!isLoading &&
                (user?.role === RoleEnum.MANAGER || user?.role === RoleEnum.STAFF) &&
                cancelAndReturnRequestData?.data?.cancelOrderRequest &&
                cancelAndReturnRequestData?.data?.cancelOrderRequest?.status === RequestStatusEnum.PENDING && (
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
                          <AlertDescription>{t('order.CancelOrderRequestBrandMessage')}</AlertDescription>
                        </div>
                      </div>
                      <div className='flex gap-2 items-center'>
                        {(useOrderData?.data?.status === ShippingStatusEnum.TO_PAY ||
                          useOrderData?.data?.status === ShippingStatusEnum.WAIT_FOR_CONFIRMATION ||
                          useOrderData?.data?.status === ShippingStatusEnum.PREPARING_ORDER) && (
                          <div className='flex gap-2 items-center'>
                            <Button
                              variant='outline'
                              className='w-full border text-destructive bg-white border-destructive hover:text-destructive hover:bg-destructive/10'
                              onClick={() => handleMakeDecisionOnCancelRequest(RequestStatusEnum.REJECTED)}
                            >
                              {isLoadingDecisionRejected ? <LoadingIcon /> : t('button.rejected')}
                            </Button>
                            <Button
                              variant='default'
                              className='w-full border text-white bg-green-500 hover:text-white hover:bg-green-400'
                              onClick={() => handleMakeDecisionOnCancelRequest(RequestStatusEnum.APPROVED)}
                            >
                              {isLoadingDecisionApproved ? <LoadingIcon /> : t('button.approved')}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              {/* order status tracking */}
              {!isFetchingStatusTracking && useStatusTrackingData && useStatusTrackingData?.data && (
                <OrderStatusTracking statusTrackingData={useStatusTrackingData?.data} />
              )}
              {/* order cancel detail */}
              {/* {useOrderData?.data?.status === ShippingStatusEnum.CANCELLED && (
                <div className='w-full flex'>
                  <OrderGeneral
                    title={t('orderDetail.cancelOrderDetails')}
                    icon={<Ban />}
                    status='danger'
                    content={
                      <div className='flex flex-col gap-1 text-sm md:text-base'>
                        <p>
                          <span className='font-medium'>{t('orderDetail.cancelByDate')}:</span>{' '}
                          {useOrderData?.data?.recipientName}
                        </p>
                        <p>
                          <span className='font-medium'>{t('orderDetail.cancelBy')}:</span>{' '}
                          {useOrderData?.data?.status === ShippingStatusEnum.CANCELLED
                            ? t('orderDetail.customer')
                            : t('orderDetail.brand')}
                        </p>
                        <p>
                          <span className='font-medium'>{t('orderDetail.cancelReason')}:</span>{' '}
                          {useOrderData?.data?.phone}
                        </p>
                      </div>
                    }
                  />
                </div>
              )} */}
              {/* order customer timeline, information, shipment */}
              <div className='flex flex-col md:flex-row gap-4 justify-between w-full items-stretch'>
                <div className='w-full md:w-1/2 flex'>
                  <OrderGeneral
                    title={t('orderDetail.timeline')}
                    icon={<History />}
                    content={
                      !isFetchingStatusTracking && useStatusTrackingData && useStatusTrackingData?.data ? (
                        <OrderStatusTrackingDetail statusTrackingData={useStatusTrackingData?.data} />
                      ) : (
                        <p></p>
                      )
                    }
                  />
                </div>
                <div className='w-full md:w-1/2 flex flex-col gap-2'>
                  <OrderGeneral
                    title={t('orderDetail.shippingAddress')}
                    icon={<Truck />}
                    content={
                      <div className='flex flex-col gap-1 text-sm md:text-base'>
                        <p>
                          <span className='font-medium'>{t('orderDetail.recipientName')}:</span>{' '}
                          {useOrderData?.data?.recipientName}
                        </p>
                        <p>
                          <span className='font-medium'>{t('orderDetail.address')}:</span>{' '}
                          {useOrderData?.data?.shippingAddress}
                        </p>
                        <p>
                          <span className='font-medium'>{t('orderDetail.phone')}:</span> {useOrderData?.data?.phone}
                        </p>
                        <p>
                          <span className='font-medium'>{t('orderDetail.notes')}:</span>{' '}
                          {useOrderData?.data?.notes ?? t('orderDetail.no')}
                        </p>
                      </div>
                    }
                  />
                  <OrderGeneral
                    title={t('orderDetail.message')}
                    icon={<MessageSquareText />}
                    content={
                      <p className='text-sm md:text-base'>
                        <span className='font-medium'>{t('orderDetail.message')}: </span>
                        {useOrderData?.data?.message && useOrderData?.data?.message !== ''
                          ? useOrderData?.data?.message
                          : t('orderDetail.no')}
                      </p>
                    }
                  />
                </div>
              </div>

              <div className='space-y-2'>
                {/* brand */}
                {user?.role === RoleEnum.ADMIN || user?.role === RoleEnum.OPERATOR ? (
                  <BrandSection
                    brand={
                      (
                        useOrderData?.data?.orderDetails?.[0]?.productClassification?.preOrderProduct ??
                        useOrderData?.data?.orderDetails?.[0]?.productClassification?.productDiscount ??
                        useOrderData?.data?.orderDetails?.[0]?.productClassification
                      )?.product?.brand || null
                    }
                  />
                ) : null}

                {/* order items */}
                <div>
                  {/* order items */}
                  <OrderDetailItems
                    orderDetails={useOrderData?.data?.orderDetails}
                    brand={
                      (
                        useOrderData?.data?.orderDetails?.[0]?.productClassification?.preOrderProduct ??
                        useOrderData?.data?.orderDetails?.[0]?.productClassification?.productDiscount ??
                        useOrderData?.data?.orderDetails?.[0]?.productClassification
                      )?.product?.brand ?? null
                    }
                    accountAvatar={useOrderData?.data?.account?.avatar ?? ''}
                    accountName={useOrderData?.data?.account?.username ?? ''}
                  />

                  {/* order summary */}
                  <OrderSummary
                    totalProductCost={useOrderData?.data?.subTotal}
                    totalBrandDiscount={useOrderData?.data?.shopVoucherDiscount}
                    totalPlatformDiscount={useOrderData?.data?.platformVoucherDiscount}
                    totalPayment={useOrderData?.data?.totalPrice}
                    paymentMethod={useOrderData?.data?.paymentMethod}
                  />
                </div>
                {(useOrderData?.data?.status === ShippingStatusEnum.TO_PAY ||
                  useOrderData?.data?.status === ShippingStatusEnum.WAIT_FOR_CONFIRMATION ||
                  useOrderData?.data?.status === ShippingStatusEnum.PREPARING_ORDER ||
                  useOrderData?.data?.status === ShippingStatusEnum.SHIPPING) &&
                  (user?.role === RoleEnum.MANAGER || user?.role === RoleEnum.STAFF) && (
                    <div className='w-full'>
                      <Button
                        variant='outline'
                        className='w-full border border-primary text-primary hover:text-primary hover:bg-primary/10'
                        onClick={() => setOpenCancelOrderDialog(true)}
                      >
                        {t('order.cancelOrder')}
                      </Button>
                    </div>
                  )}
              </div>
            </div>
          </>
        )}
        {!isFetching && (!useOrderData || !useOrderData?.data) && (
          <Empty
            title={t('empty.orderDetail.title')}
            description={t('empty.orderDetail.description')}
            link={routesConfig[Routes.ORDER_LIST].path}
            linkText={t('empty.orderDetail.button')}
          />
        )}
        {!isFetching && useOrderData?.data && (
          <CancelOrderDialog
            open={openCancelOrderDialog}
            setOpen={setOpenCancelOrderDialog}
            onOpenChange={setOpenCancelOrderDialog}
            orderId={useOrderData?.data?.id ?? ''}
          />
        )}
      </div>
    </>
  )
}

export default OrderDetails
