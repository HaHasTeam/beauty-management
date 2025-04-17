import { Box, ChevronDown, ChevronUp, Info, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { TOrderRequest } from '@/types/order-request'
import { formatCurrency } from '@/utils/number'

interface OrderRequestItemsCellProps {
  request: TOrderRequest
}

export function OrderRequestItemsCell({ request }: OrderRequestItemsCellProps) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  if (!request.order?.orderDetails?.length) {
    return (
      <div className='flex items-center text-sm text-muted-foreground p-1.5'>
        <Info className='h-4 w-4 mr-1.5 text-slate-400' />
        <span className='italic'>{t('order.request.noItems', 'No items')}</span>
      </div>
    )
  }

  const toggleExpanded = () => setExpanded(!expanded)
  const totalItems = request.order.orderDetails.length
  const totalPrice = request.order.totalPrice

  return (
    <div className='w-full rounded-md overflow-hidden'>
      <div className='p-2'>
        <div className='flex items-center space-x-2'>
          <div className='flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-50 text-blue-600 rounded-md'>
            <ShoppingBag className='h-3.5 w-3.5' />
          </div>
          <div className='flex-1 flex items-center justify-between'>
            <div className='text-sm'>
              {t('order.request.itemsCount', 'Order')} <span className='font-bold'>{totalItems}</span>{' '}
              {t('order.request.item', 'item')}
              {totalItems !== 1 ? 's' : ''} {t('order.request.withTotal', 'with')}{' '}
              <span className='font-bold'>{formatCurrency(totalPrice)}</span> {t('order.request.inTotal', 'in total')}
            </div>

            <Button variant='ghost' size='sm' className='h-7 px-2 flex-shrink-0' onClick={toggleExpanded}>
              {expanded ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
            </Button>
          </div>
        </div>

        {expanded && (
          <div className='mt-2 space-y-2 pl-8'>
            {request.order.orderDetails.map((item) => (
              <div key={item.id} className='flex items-center space-x-2 p-1.5 bg-slate-50 rounded-md'>
                <div className='h-9 w-9 rounded-md bg-white border border-slate-200 flex items-center justify-center overflow-hidden'>
                  <Box className='h-5 w-5 text-blue-400' />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='text-xs font-medium truncate'>{item.productName}</div>
                  <div className='flex justify-between text-xs text-slate-500'>
                    <span>
                      {item.classificationName && <span className='italic mr-1'>{item.classificationName}</span>}x
                      {item.quantity}
                    </span>
                    <span className='font-medium'>{formatCurrency(item.totalPrice || item.subTotal || 0)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
