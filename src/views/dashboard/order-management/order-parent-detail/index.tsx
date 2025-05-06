import { useQuery } from '@tanstack/react-query'
import { MessageSquareText, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import AlertMessage from '@/components/alert/AlertMessage'
import BrandOrderInformation from '@/components/branch/BrandOrderInformation'
import Empty from '@/components/empty/Empty'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import OrderStatus from '@/components/order-status'
import { Routes, routesConfig } from '@/configs/routes'
import { getMasterConfigApi } from '@/network/apis/master-config'
import { getParentOrderByIdApi } from '@/network/apis/order'
import { PaymentMethod, ShippingStatusEnum } from '@/types/enum'
import { calculatePaymentCountdown } from '@/utils/order'

import OrderDetailItems from '../order-detail/OrderDetailItems'
import OrderGeneral from '../order-detail/OrderGeneral'
import OrderSummary from '../order-detail/OrderSummary'

const OrderParentDetail = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const { data: useOrderData, isFetching } = useQuery({
    queryKey: [getParentOrderByIdApi.queryKey, id ?? ('' as string)],
    queryFn: getParentOrderByIdApi.fn
  })

  const { data: masterConfig } = useQuery({
    queryKey: [getMasterConfigApi.queryKey],
    queryFn: getMasterConfigApi.fn
  })

  useEffect(() => {
    if (masterConfig && useOrderData && useOrderData.data) {
      setTimeLeft(calculatePaymentCountdown(useOrderData.data, masterConfig.data).timeLeft)
      const timer = setInterval(() => {
        setTimeLeft(calculatePaymentCountdown(useOrderData.data, masterConfig.data).timeLeft)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [useOrderData, masterConfig])

  return (
    <div>
      {isFetching && <LoadingContentLayer />}
      <div className='w-full lg:px-5 md:px-4 sm:px-3 px-3 space-y-6 my-5'>
        <div className='flex gap-2 w-full sm:justify-between sm:items-center sm:flex-row flex-col'>
          <div className='flex gap-2 items-center'>
            <span className='text-lg text-muted-foreground font-medium'>{t('orderDetail.title')}</span>
            {!isFetching && useOrderData?.data && (
              <span className='text-lg text-muted-foreground'>
                #{useOrderData?.data?.id?.substring(0, 8).toUpperCase()}
              </span>
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
              {/* payment */}
              {(useOrderData.data.paymentMethod === PaymentMethod.WALLET ||
                useOrderData.data.paymentMethod === PaymentMethod.BANK_TRANSFER) &&
                useOrderData.data.status === ShippingStatusEnum.TO_PAY && (
                  <AlertMessage
                    title={t('order.paymentTitle')}
                    message={t('payment.notifyPayment', {
                      total: t('productCard.currentPrice', { price: useOrderData?.data.totalPrice }),
                      val:
                        String(timeLeft.hours).padStart(2, '0') +
                        ':' +
                        String(timeLeft.minutes).padStart(2, '0') +
                        ':' +
                        String(timeLeft.seconds).padStart(2, '0'),
                      method:
                        useOrderData?.data.paymentMethod === PaymentMethod.WALLET
                          ? t('wallet.WALLET')
                          : useOrderData?.data.paymentMethod === PaymentMethod.BANK_TRANSFER
                            ? t('payment.methods.bank_transfer')
                            : t('payment.methods.cash')
                    })}
                    isShowIcon={false}
                  />
                )}

              {/* order customer timeline, information, shipment */}
              <div className='flex flex-col md:flex-row gap-4 justify-between w-full items-stretch'>
                <div className='w-full flex flex-col gap-2'>
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
                </div>
              </div>

              {useOrderData.data.children &&
                useOrderData.data.children.length > 0 &&
                useOrderData.data.children.map((orderItem, index) => (
                  <div className='space-y-2 p-3 bg-card border border-primary/30 shadow-md rounded-md'>
                    {/* Order ID */}

                    <div className='flex items-center justify-between gap-2'>
                      <div>
                        <span className='text-sm sm:text-base'>{t('orderDetail.orderChildren')}</span>
                        <Link
                          to={routesConfig[Routes.ORDER_LIST].getPath() + '/' + orderItem.id}
                          className='ml-1 text-sm font-medium text-muted-foreground text-blue-500 no-underline'
                        >
                          #{orderItem.id.substring(0, 8).toUpperCase()}
                        </Link>
                      </div>
                      <div className='text-muted-foreground text-sm'>#{index + 1}</div>
                    </div>

                    {/* brand */}
                    <BrandOrderInformation
                      brandId={
                        (
                          orderItem?.orderDetails?.[0]?.productClassification?.preOrderProduct ??
                          orderItem?.orderDetails?.[0]?.productClassification?.productDiscount ??
                          orderItem?.orderDetails?.[0]?.productClassification
                        )?.product?.brand?.id ?? ''
                      }
                      brandName={
                        (
                          orderItem?.orderDetails?.[0]?.productClassification?.preOrderProduct ??
                          orderItem?.orderDetails?.[0]?.productClassification?.productDiscount ??
                          orderItem?.orderDetails?.[0]?.productClassification
                        )?.product?.brand?.name ?? 'Brand'
                      }
                      brandLogo={
                        (
                          orderItem?.orderDetails?.[0]?.productClassification?.preOrderProduct ??
                          orderItem?.orderDetails?.[0]?.productClassification?.productDiscount ??
                          orderItem?.orderDetails?.[0]?.productClassification
                        )?.product?.brand?.logo ?? 'Brand'
                      }
                    />

                    {/* order children items */}
                    <div>
                      {/* order items */}
                      <OrderDetailItems
                        orderDetails={orderItem?.orderDetails ?? []}
                        brand={
                          (
                            orderItem?.orderDetails?.[0]?.productClassification?.preOrderProduct ??
                            orderItem?.orderDetails?.[0]?.productClassification?.productDiscount ??
                            orderItem?.orderDetails?.[0]?.productClassification
                          )?.product?.brand ?? null
                        }
                        accountAvatar={orderItem?.account?.avatar ?? ''}
                        accountName={orderItem?.account?.username ?? ''}
                      />

                      {/* order summary */}
                      <OrderSummary
                        totalProductCost={orderItem?.subTotal}
                        totalBrandDiscount={orderItem?.shopVoucherDiscount}
                        totalPlatformDiscount={orderItem?.platformVoucherDiscount}
                        brandVoucher={orderItem?.voucher || null}
                        platformVoucher={useOrderData?.data?.voucher || null}
                        livestream={orderItem?.children?.[index]?.livestream || null}
                        totalPayment={orderItem?.totalPrice}
                        paymentMethod={orderItem?.paymentMethod}
                        orderParent={null}
                        orderStatus={orderItem?.status}
                        groupBuying={orderItem?.groupBuying}
                        commissionFee={orderItem?.commissionFee}
                      />
                    </div>

                    <OrderGeneral
                      title={t('orderDetail.message')}
                      icon={<MessageSquareText />}
                      content={
                        <p className='text-sm md:text-base'>
                          <span className='font-medium'>{t('orderDetail.message')}: </span>
                          {orderItem?.message && orderItem?.message !== '' ? orderItem?.message : t('orderDetail.no')}
                        </p>
                      }
                    />
                  </div>
                ))}
            </div>
          </>
        )}
        {!isFetching && (!useOrderData || !useOrderData?.data) && (
          <Empty
            title={t('empty.orderDetail.title')}
            description={t('empty.orderDetail.description')}
            link={routesConfig[Routes.ORDER_LIST].getPath()}
            linkText={t('empty.orderDetail.button')}
          />
        )}
      </div>
    </div>
  )
}

export default OrderParentDetail
