import { useQuery } from '@tanstack/react-query'
import { History, MessageSquareText, Truck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import AlertMessage from '@/components/alert/AlertMessage'
import BrandSection from '@/components/branch/BrandSection'
import Button from '@/components/button'
import CancelOrderDialog from '@/components/dialog/CancelOrderDialog'
import UpdateOrderStatus from '@/components/dialog/UpdateOrderStatusDialog'
import Empty from '@/components/empty/Empty'
import LoadingLayer from '@/components/loading-icon/LoadingLayer'
import OrderStatus from '@/components/order-status'
import { Routes, routesConfig } from '@/configs/routes'
import { getMasterConfigApi } from '@/network/apis/master-config'
import { getCancelAndReturnRequestApi, getOrderByIdApi, getStatusTrackingByIdApi } from '@/network/apis/order'
import { useStore } from '@/stores/store'
import { RequestStatusEnum, RoleEnum, ShippingStatusEnum } from '@/types/enum'
import { millisecondsToRoundedDays } from '@/utils/time'

import ConfirmDecisionDialog from './ConfirmDecisionDialog'
import MakeDecisionOnCancelRequest from './MakeDecisionOnCancelRequest'
import MakeDecisionOnComplaint from './MakeDecisionOnComplaint'
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
  const [openCancelOrderDialog, setOpenCancelOrderDialog] = useState<boolean>(false)
  const [openTrackReturn, setOpenTrackReturn] = useState<boolean>(false)
  const [openTrackComplaint, setOpenTrackComplaint] = useState<boolean>(false)

  const { user } = useStore(
    useShallow((state) => ({
      user: state.user
    }))
  )
  const { data: masterConfig } = useQuery({
    queryKey: [getMasterConfigApi.queryKey],
    queryFn: getMasterConfigApi.fn
  })
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

  // const pendingRequestCancelTime = useMemo(() => {
  //   return millisecondsToRoundedDays(parseInt(masterConfig?.data[0].autoApprovedRequestCancelTime ?? ''))
  // }, [masterConfig?.data])

  const autoApproveRefundRequestTime = useMemo(() => {
    return millisecondsToRoundedDays(parseInt(masterConfig?.data[0].autoApproveRefundRequestTime ?? ''))
  }, [masterConfig?.data])
  const pendingAdminCheckRejectRefundRequestTime = useMemo(() => {
    return millisecondsToRoundedDays(parseInt(masterConfig?.data[0].pendingAdminCheckRejectRefundRequestTime ?? ''))
  }, [masterConfig?.data])

  const pendingRequestComplaintTime = useMemo(() => {
    return millisecondsToRoundedDays(parseInt(masterConfig?.data[0].pendingAdminCheckComplaintRequestTime ?? ''))
  }, [masterConfig?.data])
  const expiredReceivedTime = useMemo(() => {
    return millisecondsToRoundedDays(parseInt(masterConfig?.data[0].expiredReceivedTime ?? ''))
  }, [masterConfig?.data])
  const autoUpdateOrderToRefundedStatusTime = useMemo(() => {
    return millisecondsToRoundedDays(parseInt(masterConfig?.data[0].autoUpdateOrderToRefundedStatusTime ?? ''))
  }, [masterConfig?.data])
  const pendingCustomerShippingReturnTime = useMemo(() => {
    return millisecondsToRoundedDays(parseInt(masterConfig?.data[0].pendingCustomerShippingReturnTime ?? ''))
  }, [masterConfig?.data])
  return (
    <>
      {isFetching && <LoadingLayer />}
      <div className='w-full lg:px-5 md:px-4 sm:px-3 px-3 space-y-6 my-5'>
        <div className='flex gap-2 w-full sm:justify-between sm:items-center sm:flex-row flex-col'>
          <div className='flex gap-2 sm:items-center sm:flex-row flex-col'>
            <span className='text-lg text-muted-foreground font-medium'>{t('orderDetail.title')}</span>
            {/* {!isFetching && useOrderData?.data && (
              <span className='text-lg text-muted-foreground'>#{useOrderData?.data?.id}</span>
            )} */}
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
                <UpdateOrderStatus
                  order={useOrderData?.data}
                  setOpenCancelOrderDialog={setOpenCancelOrderDialog}
                  cancelOrderRequest={cancelAndReturnRequestData?.data?.cancelRequest ?? null}
                  complaintRequest={cancelAndReturnRequestData?.data?.complaintRequest ?? null}
                  expiredReceivedTime={expiredReceivedTime}
                  autoUpdateOrderToRefundedStatusTime={autoUpdateOrderToRefundedStatusTime}
                  statusTracking={useStatusTrackingData?.data}
                  masterConfig={masterConfig?.data}
                />
              )}
              {/* alert complaint request return order */}
              {/* brand */}
              {(user?.role === RoleEnum.MANAGER || user?.role === RoleEnum.STAFF) &&
                cancelAndReturnRequestData?.data?.complaintRequest?.status === RequestStatusEnum.PENDING && (
                  <AlertMessage
                    title={t('return.complaintRequestPendingTitleBrand')}
                    message={t('return.complaintRequestPendingMessageBrand', { count: pendingRequestComplaintTime })}
                    isShowIcon={false}
                    color='warn'
                    buttonText='view'
                    buttonClassName='bg-yellow-500 hover:bg-yellow-600'
                    onClick={() => setOpenTrackComplaint(true)}
                  />
                )}
              {(user?.role === RoleEnum.MANAGER || user?.role === RoleEnum.STAFF) &&
                cancelAndReturnRequestData?.data?.complaintRequest?.status === RequestStatusEnum.APPROVED && (
                  <AlertMessage
                    title={t('return.complaintRequestApprovedTitleBrand')}
                    message={t('return.complaintRequestApprovedMessageBrand')}
                    isShowIcon={false}
                    color='success'
                    buttonText='view'
                    buttonClassName='bg-green-500 hover:bg-green-600'
                    onClick={() => setOpenTrackComplaint(true)}
                  />
                )}
              {(user?.role === RoleEnum.MANAGER || user?.role === RoleEnum.STAFF) &&
                cancelAndReturnRequestData?.data?.complaintRequest?.status === RequestStatusEnum.REJECTED && (
                  <AlertMessage
                    title={t('return.complaintRequestRejectedTitleBrand')}
                    message={t('return.complaintRequestRejectedMessageBrand')}
                    isShowIcon={false}
                    color='danger'
                    buttonText='view'
                    buttonClassName='bg-red-500 hover:bg-red-600'
                    onClick={() => setOpenTrackComplaint(true)}
                  />
                )}

              {/* alert complaint request return order */}
              {/* admin */}
              {(user?.role === RoleEnum.ADMIN || user?.role === RoleEnum.OPERATOR) &&
                cancelAndReturnRequestData?.data?.complaintRequest?.status === RequestStatusEnum.PENDING && (
                  <MakeDecisionOnComplaint
                    complaintRequest={cancelAndReturnRequestData?.data?.complaintRequest || null}
                    pendingRequestComplaintTime={pendingRequestComplaintTime}
                  />
                )}

              {/* alert make decision request return order */}
              {/* brand */}
              {(user?.role === RoleEnum.MANAGER || user?.role === RoleEnum.STAFF) &&
                cancelAndReturnRequestData?.data?.refundRequest?.status === RequestStatusEnum.PENDING && (
                  <MakeDecisionOnReturnRequest
                    returnRequest={cancelAndReturnRequestData?.data?.refundRequest || null}
                    pendingRequestReturnTime={autoApproveRefundRequestTime}
                  />
                )}
              {(user?.role === RoleEnum.MANAGER || user?.role === RoleEnum.STAFF) &&
                cancelAndReturnRequestData?.data?.refundRequest?.status === RequestStatusEnum.APPROVED && (
                  <AlertMessage
                    title={t('return.returnRequestApprovedTitleBrand')}
                    message={t('return.returnRequestApprovedMessageBrand', {
                      count: pendingCustomerShippingReturnTime
                    })}
                    isShowIcon={false}
                    color='success'
                    buttonText='view'
                    buttonClassName='bg-green-500 hover:bg-green-600'
                    onClick={() => setOpenTrackReturn(true)}
                  />
                )}

              {/* brand */}
              {/* alert make decision request reject return order */}
              {(user?.role === RoleEnum.MANAGER || user?.role === RoleEnum.STAFF) &&
                cancelAndReturnRequestData?.data?.refundRequest?.status === RequestStatusEnum.REJECTED &&
                cancelAndReturnRequestData?.data?.refundRequest?.rejectedRefundRequest?.status ===
                  RequestStatusEnum.PENDING && (
                  <AlertMessage
                    title={t('return.rejectReturnRequestPendingTitleBrand')}
                    message={t('return.rejectReturnRequestPendingMessageBrand', {
                      count: pendingAdminCheckRejectRefundRequestTime
                    })}
                    isShowIcon={false}
                  />
                )}
              {(user?.role === RoleEnum.MANAGER || user?.role === RoleEnum.STAFF) &&
                cancelAndReturnRequestData?.data?.refundRequest?.status === RequestStatusEnum.REJECTED &&
                cancelAndReturnRequestData?.data?.refundRequest?.rejectedRefundRequest?.status ===
                  RequestStatusEnum.APPROVED && (
                  <AlertMessage
                    title={t('return.rejectReturnRequestApprovedTitleBrand')}
                    message={t('return.rejectReturnRequestApprovedMessageBrand')}
                    isShowIcon={false}
                    color='success'
                    buttonText='view'
                    buttonClassName='bg-green-500 hover:bg-green-600'
                    onClick={() => setOpenTrackReturn(true)}
                  />
                )}
              {(user?.role === RoleEnum.MANAGER || user?.role === RoleEnum.STAFF) &&
                cancelAndReturnRequestData?.data?.refundRequest?.status === RequestStatusEnum.REJECTED &&
                cancelAndReturnRequestData?.data?.refundRequest?.rejectedRefundRequest?.status ===
                  RequestStatusEnum.REJECTED && (
                  <AlertMessage
                    title={t('return.rejectReturnRequestRejectedTitleBrand')}
                    message={t('return.rejectReturnRequestRejectedMessageBrand')}
                    isShowIcon={false}
                    color='danger'
                    buttonText='view'
                    buttonClassName='bg-red-500 hover:bg-red-600'
                    onClick={() => setOpenTrackReturn(true)}
                  />
                )}
              {/* admin */}
              {(user?.role === RoleEnum.ADMIN || user?.role === RoleEnum.OPERATOR) &&
                cancelAndReturnRequestData?.data?.refundRequest?.status === RequestStatusEnum.PENDING && (
                  <AlertMessage
                    title={t('return.returnRequestPendingTitleAdmin')}
                    message={t('return.returnRequestPendingMessageAdmin')}
                    isShowIcon={false}
                    buttonText='view'
                    buttonClassName='bg-yellow-500 hover:bg-yellow-600'
                    onClick={() => setOpenTrackReturn(true)}
                  />
                )}
              {(user?.role === RoleEnum.ADMIN || user?.role === RoleEnum.OPERATOR) &&
                cancelAndReturnRequestData?.data?.complaintRequest?.status === RequestStatusEnum.APPROVED && (
                  <AlertMessage
                    title={t('return.complaintRequestApprovedTitleAdmin')}
                    message={t('return.complaintRequestApprovedMessageAdmin')}
                    isShowIcon={false}
                    color='success'
                    buttonText='view'
                    buttonClassName='bg-green-500 hover:bg-green-600'
                    onClick={() => setOpenTrackComplaint(true)}
                  />
                )}
              {(user?.role === RoleEnum.ADMIN || user?.role === RoleEnum.OPERATOR) &&
                cancelAndReturnRequestData?.data?.complaintRequest?.status === RequestStatusEnum.REJECTED && (
                  <AlertMessage
                    title={t('return.complaintRequestRejectedTitleAdmin')}
                    message={t('return.complaintRequestRejectedMessageAdmin')}
                    isShowIcon={false}
                    color='danger'
                    buttonText='view'
                    buttonClassName='bg-red-500 hover:bg-red-600'
                    onClick={() => setOpenTrackComplaint(true)}
                  />
                )}

              {/* alert make decision request reject return order */}
              {/* admin */}
              {(user?.role === RoleEnum.ADMIN || user?.role === RoleEnum.OPERATOR) &&
                cancelAndReturnRequestData?.data?.refundRequest?.status === RequestStatusEnum.REJECTED &&
                cancelAndReturnRequestData?.data?.refundRequest?.rejectedRefundRequest?.status ===
                  RequestStatusEnum.PENDING && (
                  <MakeDecisionOnReturnRejectRequest
                    rejectReturnRequest={cancelAndReturnRequestData?.data?.refundRequest?.rejectedRefundRequest || null}
                    refundRequest={cancelAndReturnRequestData?.data?.refundRequest}
                    pendingAdminCheckRejectRefundRequestTime={pendingAdminCheckRejectRefundRequestTime}
                  />
                )}

              {/* handle cancel request for brand and system role */}
              {(user?.role === RoleEnum.MANAGER || user?.role === RoleEnum.STAFF) &&
                cancelAndReturnRequestData?.data?.cancelRequest &&
                cancelAndReturnRequestData?.data?.cancelRequest?.status === RequestStatusEnum.PENDING && (
                  <MakeDecisionOnCancelRequest
                    cancelOrderRequest={cancelAndReturnRequestData?.data?.cancelRequest}
                    // pendingRequestCancelTime={pendingRequestCancelTime}
                  />
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
                        <OrderStatusTrackingDetail
                          statusTrackingData={useStatusTrackingData?.data}
                          cancelAndReturnRequest={cancelAndReturnRequestData?.data}
                        />
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
                          {useOrderData?.data?.notes && useOrderData?.data?.notes !== ''
                            ? useOrderData?.data?.notes
                            : t('orderDetail.no')}
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
                    brandVoucherId={useOrderData?.data?.shopVoucherId}
                    platformVoucherId={useOrderData?.data?.platformVoucherId}
                    livestreamId={useOrderData?.data?.livestreamId}
                  />
                </div>
                {(useOrderData?.data?.status === ShippingStatusEnum.TO_PAY ||
                  useOrderData?.data?.status === ShippingStatusEnum.WAIT_FOR_CONFIRMATION ||
                  (useOrderData?.data?.status === ShippingStatusEnum.PREPARING_ORDER &&
                    !cancelAndReturnRequestData?.data?.cancelRequest) ||
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
        {!isFetching && useOrderData?.data && cancelAndReturnRequestData?.data?.refundRequest && (
          <ConfirmDecisionDialog
            isLoadingDecisionApproved
            isLoadingDecisionRejected
            open={openTrackReturn}
            onOpenChange={setOpenTrackReturn}
            onConfirm={() => {}}
            item={'returnTrackView'}
            rejectBy={cancelAndReturnRequestData?.data?.refundRequest?.updatedBy?.username}
            rejectByRole={cancelAndReturnRequestData?.data?.refundRequest?.updatedBy?.role?.role}
            rejectTime={cancelAndReturnRequestData?.data?.refundRequest?.rejectedRefundRequest?.createdAt}
            reviewTime={cancelAndReturnRequestData?.data?.refundRequest?.rejectedRefundRequest?.updatedAt}
            rejectReason={cancelAndReturnRequestData?.data?.refundRequest?.rejectedRefundRequest?.reason}
            rejectMediaFiles={cancelAndReturnRequestData?.data?.refundRequest?.rejectedRefundRequest?.mediaFiles}
            reason={cancelAndReturnRequestData?.data?.refundRequest?.reason}
            mediaFiles={cancelAndReturnRequestData?.data?.refundRequest?.mediaFiles}
            returnTime={cancelAndReturnRequestData?.data?.refundRequest?.createdAt}
            returnRequest={cancelAndReturnRequestData?.data?.refundRequest}
            isRejectRequest={cancelAndReturnRequestData?.data?.refundRequest?.rejectedRefundRequest !== null}
            isShowAction={false}
            status={cancelAndReturnRequestData?.data?.refundRequest?.status}
            rejectStatus={cancelAndReturnRequestData?.data?.refundRequest?.rejectedRefundRequest?.status}
            reasonRejected={cancelAndReturnRequestData?.data?.refundRequest?.rejectedRefundRequest?.reasonRejected}
          />
        )}
        {!isFetching && useOrderData?.data && cancelAndReturnRequestData?.data?.complaintRequest && (
          <ConfirmDecisionDialog
            isLoadingDecisionApproved
            isLoadingDecisionRejected
            open={openTrackComplaint}
            onOpenChange={setOpenTrackComplaint}
            onConfirm={() => {}}
            item={'complaintTrackView'}
            rejectReason={''}
            rejectMediaFiles={[]}
            reason={cancelAndReturnRequestData?.data?.complaintRequest?.reason}
            mediaFiles={cancelAndReturnRequestData?.data?.complaintRequest?.mediaFiles}
            returnRequest={cancelAndReturnRequestData?.data?.complaintRequest}
            isRejectRequest={false}
            isShowAction={false}
            rejectStatus={cancelAndReturnRequestData?.data?.complaintRequest?.status}
            status={cancelAndReturnRequestData?.data?.complaintRequest?.status}
            reasonRejected={cancelAndReturnRequestData?.data?.complaintRequest?.reasonRejected}
            rejectReview={cancelAndReturnRequestData?.data?.complaintRequest?.updatedBy?.username}
            rejectReviewRole={cancelAndReturnRequestData?.data?.complaintRequest?.updatedBy?.role?.role}
            reviewTime={cancelAndReturnRequestData?.data?.complaintRequest?.updatedAt}
            returnTime={cancelAndReturnRequestData?.data?.complaintRequest.createdAt}
          />
        )}
        {/* {!isFetching && useOrderData?.data && cancelAndReturnRequestData?.data?.refundRequest && (
          <ConfirmDecisionDialog
            isLoadingDecisionApproved
            isLoadingDecisionRejected
            open={openTrackReturn}
            onOpenChange={setOpenTrackReturn}
            onConfirm={() => {}}
            item={'returnTrackView'}
            rejectReason={cancelAndReturnRequestData?.data?.refundRequest?.rejectedRefundRequest?.reason}
            rejectMediaFiles={cancelAndReturnRequestData?.data?.refundRequest?.rejectedRefundRequest?.mediaFiles}
            reason={cancelAndReturnRequestData?.data?.refundRequest?.reason}
            mediaFiles={cancelAndReturnRequestData?.data?.refundRequest?.mediaFiles}
            returnRequest={cancelAndReturnRequestData?.data?.refundRequest}
            isRejectRequest={cancelAndReturnRequestData?.data?.refundRequest?.rejectedRefundRequest !== null}
            isShowAction={false}
            status={cancelAndReturnRequestData?.data?.refundRequest?.status}
            rejectStatus={cancelAndReturnRequestData?.data?.refundRequest?.rejectedRefundRequest?.status}
            reasonRejected={cancelAndReturnRequestData?.data?.refundRequest?.reasonRejected}
          />
        )} */}
        {/* {!isFetching && useOrderData?.data && cancelAndReturnRequestData?.data?.complaintRequest && (
          <ConfirmDecisionDialog
            isLoadingDecisionApproved
            isLoadingDecisionRejected
            open={openTrackComplaint}
            onOpenChange={setOpenTrackComplaint}
            onConfirm={() => {}}
            item={'complaintTrackView'}
            rejectReason={''}
            rejectMediaFiles={[]}
            reason={cancelAndReturnRequestData?.data?.complaintRequest?.reason}
            mediaFiles={cancelAndReturnRequestData?.data?.complaintRequest?.mediaFiles}
            returnRequest={cancelAndReturnRequestData?.data?.complaintRequest}
            isRejectRequest={false}
            isShowAction={false}
            rejectStatus={cancelAndReturnRequestData?.data?.complaintRequest?.status}
            status={cancelAndReturnRequestData?.data?.complaintRequest?.status}
            reasonRejected={cancelAndReturnRequestData?.data?.complaintRequest?.reasonRejected}
          />
        )} */}
      </div>
    </>
  )
}

export default OrderDetails
