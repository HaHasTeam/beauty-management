import { useQuery } from '@tanstack/react-query'
import { MessageSquareText, Truck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import Empty from '@/components/empty/Empty'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import OrderStatus from '@/components/order-status'
import { Routes, routesConfig } from '@/configs/routes'
import { getOrderByIdApi } from '@/network/apis/order'
import { useStore } from '@/stores/store'
import { RoleEnum } from '@/types/enum'

import BrandOrderInformation from './order-detail/BrandOrderInformation'
import OrderDetailItems from './order-detail/OrderDetailItems'
import OrderGeneral from './order-detail/OrderGeneral'
import OrderStatusTracking from './order-detail/OrderStatusTracking'
import OrderSummary from './order-detail/OrderSummary'

const OrderDetails = () => {
  const { id } = useParams()
  const { t } = useTranslation()

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
              <OrderStatusTracking currentStatus={useOrderData?.data?.status} />

              {/* order customer information, shipment */}
              <div className='flex flex-col md:flex-row gap-4 justify-between w-full items-stretch'>
                <div className='w-full md:w-1/2 flex'>
                  <OrderGeneral
                    title={t('orderDetail.shippingAddress')}
                    icon={<Truck />}
                    content={
                      <div className='flex flex-col gap-1 text-sm md:text-base'>
                        <span>
                          {t('orderDetail.recipientName')}: {useOrderData?.data?.recipientName}
                        </span>
                        <span>
                          {t('orderDetail.address')}: {useOrderData?.data?.shippingAddress}
                        </span>
                        <span>
                          {t('orderDetail.phone')}: {useOrderData?.data?.phone}
                        </span>
                        <span>
                          {t('orderDetail.notes')}: {useOrderData?.data?.notes ?? t('orderDetail.no')}
                        </span>
                      </div>
                    }
                  />
                </div>
                <div className='w-full md:w-1/2 flex'>
                  <OrderGeneral
                    title={t('orderDetail.message')}
                    icon={<MessageSquareText />}
                    content={
                      <span className='text-sm md:text-base'>
                        {t('orderDetail.message')}:{' '}
                        {useOrderData?.data?.message && useOrderData?.data?.message !== ''
                          ? useOrderData?.data?.message
                          : t('orderDetail.no')}
                      </span>
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
      </div>
    </>
  )
}

export default OrderDetails
