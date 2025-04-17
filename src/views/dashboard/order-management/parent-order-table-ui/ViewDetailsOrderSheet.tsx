import * as React from 'react'
import { useTranslation } from 'react-i18next'

import CardSection from '@/components/card-section'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { formatDate } from '@/lib/utils'
import { IOrder } from '@/types/order'

import { getStatusIcon } from './helper'

interface ViewDetailsOrderSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  order?: IOrder
}

export function ViewDetailsOrderSheet({ order, ...props }: ViewDetailsOrderSheetProps) {
  const { t } = useTranslation()
  if (!order) return null

  const StatusIcon = getStatusIcon(order.status)

  return (
    <Sheet {...props}>
      <SheetContent className='flex flex-col gap-6 sm:max-w-xl max-sm:w-full overflow-y-auto'>
        <CardSection
          title={`Order #${order.id.slice(0, 8)}`}
          description={`Order details for ${order.recipientName}`}
          rightComponent={
            <Badge variant='outline' className={`${StatusIcon.bgColor} ${StatusIcon.textColor}`}>
              <StatusIcon.icon className='mr-2 h-4 w-4' />
              {order.status}
            </Badge>
          }
        >
          <div className='grid gap-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm font-medium'>Recipient</p>
                <p className='text-sm'>{order.recipientName}</p>
              </div>
              <div>
                <p className='text-sm font-medium'>Phone</p>
                <p className='text-sm'>{order.phone}</p>
              </div>
              <div className='col-span-2'>
                <p className='text-sm font-medium'>Shipping Address</p>
                <p className='text-sm'>{order.shippingAddress}</p>
              </div>
            </div>
            <Separator />
            <div>
              <p className='text-sm font-medium mb-2'>Order Details</p>
              <div className='space-y-2'>
                {order?.children?.map((child) => <OrderItemDetails key={child.id} item={child} />)}
              </div>
            </div>
            <Separator />
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm font-medium'>Payment Method</p>
                <p className='text-sm'>{order.paymentMethod}</p>
              </div>
              <div>
                <p className='text-sm font-medium'>Order Date</p>
                <p className='text-sm'>{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className='text-sm font-medium'>Subtotal</p>
                <p className='text-sm'>{t('order.totalPrice', { price: order.subTotal })}</p>
              </div>
              <div>
                <p className='text-sm font-medium'>Total</p>
                <p className='text-sm font-bold'>{t('order.totalPrice', { price: order.totalPrice })}</p>
              </div>
            </div>
            {order.notes && (
              <>
                <Separator />
                <div>
                  <p className='text-sm font-medium'>Notes</p>
                  <p className='text-sm'>{order.notes}</p>
                </div>
              </>
            )}
          </div>
        </CardSection>
      </SheetContent>
    </Sheet>
  )
}

function OrderItemDetails({ item }: { item: IOrder }) {
  const { t } = useTranslation()

  return (
    <div className='flex justify-between items-start'>
      <div>
        <p className='text-sm font-medium'>Recipient Name: {item.recipientName}</p>
        <p className='text-xs text-muted-foreground'>Address: {item.shippingAddress}</p>
        <p className='text-xs'>Payment Method: {item.paymentMethod}</p>
      </div>
      <p className='text-sm font-medium'>{t('order.totalPrice', { price: item.totalPrice })}</p>
    </div>
  )
}
