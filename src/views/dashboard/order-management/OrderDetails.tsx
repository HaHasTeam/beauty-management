import { useQuery, useQueryClient } from '@tanstack/react-query'
import { History, MessageSquareText, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import Button from '@/components/button'
import CancelOrderDialog from '@/components/dialog/CancelOrderDialog'
import Empty from '@/components/empty/Empty'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import OrderStatus from '@/components/order-status'
import { Routes, routesConfig } from '@/configs/routes'
import { getOrderByIdApi, getStatusTrackingByIdApi } from '@/network/apis/order'
import { useStore } from '@/stores/store'
import { RoleEnum, ShippingStatusEnum } from '@/types/enum'

import BrandOrderInformation from './order-detail/BrandOrderInformation'
import OrderDetailItems from './order-detail/OrderDetailItems'
import OrderGeneral from './order-detail/OrderGeneral'
import OrderStatusTracking from './order-detail/OrderStatusTracking'
import OrderStatusTrackingDetail from './order-detail/OrderStatusTrackingDetail'
import OrderSummary from './order-detail/OrderSummary'

const OrderDetails = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [openCancelOrderDialog, setOpenCancelOrderDialog] = useState<boolean>(false)
  const [isTrigger, setIsTrigger] = useState<boolean>(false)

  const { user } = useStore(
    useShallow((state) => ({
      // addProduct: state.addProduct,
      // removeProduct: state.removeProduct,
      // incQty: state.incQty,
      // decQty: state.decQty,
      // setTotal: state.setTotal,
      // reset: state.reset,
      user: state.user
    }))
  )
  const { data: useOrderData, isFetching } = useQuery({
    queryKey: [getOrderByIdApi.queryKey, id as string],
    queryFn: getOrderByIdApi.fn,
    enabled: !!id
  })
  const { data: useStatusTrackingData, isFetching: isFetchingStatusTracking } = useQuery({
    queryKey: [getStatusTrackingByIdApi.queryKey, id ?? ('' as string)],
    queryFn: getStatusTrackingByIdApi.fn,
    enabled: !!id
  })

  useEffect(() => {
    if (isTrigger) {
      queryClient.invalidateQueries({
        queryKey: [getOrderByIdApi.queryKey]
      })
    }
  }, [isTrigger, queryClient])

  return (
    <>
      {isFetching && <LoadingContentLayer />}
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
                {user?.role === RoleEnum.ADMIN ? (
                  <BrandOrderInformation
                    brandId={
                      (
                        useOrderData?.data?.orderDetails?.[0]?.productClassification?.preOrderProduct ??
                        useOrderData?.data?.orderDetails?.[0]?.productClassification?.productDiscount ??
                        useOrderData?.data?.orderDetails?.[0]?.productClassification
                      )?.product?.brand?.id ?? ''
                    }
                    brandName={
                      (
                        useOrderData?.data?.orderDetails?.[0]?.productClassification?.preOrderProduct ??
                        useOrderData?.data?.orderDetails?.[0]?.productClassification?.productDiscount ??
                        useOrderData?.data?.orderDetails?.[0]?.productClassification
                      )?.product?.brand?.name ?? 'Brand'
                    }
                  />
                ) : null}

                {/* order items */}
                <div>
                  {/* order items */}
                  <OrderDetailItems
                    orderDetails={useOrderData?.data?.orderDetails}
                    status={useOrderData?.data?.status}
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
                  useOrderData?.data?.status === ShippingStatusEnum.PREPARING_ORDER) && (
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
            setIsTrigger={setIsTrigger}
            orderId={useOrderData?.data?.id ?? ''}
          />
        )}
      </div>
    </>
  )
}

export default OrderDetails
