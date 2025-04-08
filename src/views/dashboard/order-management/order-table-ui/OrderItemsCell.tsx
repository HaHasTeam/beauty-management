import { Box, ChevronDown, ChevronUp, Info, Package, ShoppingBag } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { IOrder, IOrderDetail } from '@/types/order'
import { formatCurrency } from '@/utils/number'

// Extended interface to optionally include orderDetails which might be present at runtime

type OrderItemsCellProps = {
  order: IOrder
}

export function OrderItemsCell({ order }: OrderItemsCellProps) {
  const [expanded, setExpanded] = useState(false)

  // First check for children (order items)
  const hasChildren = order.children && order.children.length > 0

  // Also check for orderDetails (may be present in some orders)
  const hasOrderDetails = order.orderDetails && order.orderDetails.length > 0

  // If no items, show a placeholder
  if (!hasChildren && !hasOrderDetails) {
    return (
      <div className='flex items-center text-sm text-muted-foreground p-1.5'>
        <Info className='h-4 w-4 mr-1.5 text-slate-400' />
        <span className='italic'>N/A</span>
      </div>
    )
  }

  const toggleExpanded = () => setExpanded(!expanded)

  // Get items from either children or orderDetails
  const items = hasChildren ? order.children : hasOrderDetails ? order.orderDetails : []

  // Count total items or use length of items array
  const totalItems = items ? items.length : 0

  return (
    <div className='w-full rounded-md overflow-hidden'>
      <div className='p-2'>
        <div className='flex items-center space-x-2'>
          <div className='flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-50 text-blue-600 rounded-md'>
            <ShoppingBag className='h-3.5 w-3.5' />
          </div>
          <div className='flex-1 flex items-center justify-between'>
            <div className='text-sm'>
              Order <span className='font-bold'>{totalItems}</span> item{totalItems !== 1 ? 's' : ''} with{' '}
              <span className='font-bold'>{formatCurrency(order.totalPrice)}</span> in total
            </div>

            <Button variant='ghost' size='sm' className='h-7 px-2 flex-shrink-0' onClick={toggleExpanded}>
              {expanded ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
            </Button>
          </div>
        </div>

        {expanded && (
          <div className='mt-2 space-y-2 pl-8'>
            {/* Handle child orders */}
            {hasChildren &&
              order.children?.map((childOrder, index) => {
                // Try to cast childOrder to our extended interface
                const childWithDetails = childOrder as IOrder
                // Check if the child has orderDetails
                const childDetails = childWithDetails.orderDetails || []

                return (
                  <div key={childOrder.id || index} className='space-y-1.5'>
                    <div className='flex items-center space-x-2'>
                      <div className='flex-shrink-0 flex items-center justify-center w-5 h-5 bg-slate-100 text-slate-600 rounded-md'>
                        <Package className='h-3 w-3' />
                      </div>
                      <div className='text-xs font-medium'>Package {index + 1}</div>
                    </div>

                    {/* Display child order items if there are any */}
                    {childDetails &&
                      childDetails.length > 0 &&
                      childDetails.map((item, itemIndex) => (
                        <OrderDetailItem key={item.id || `item-${itemIndex}`} detail={item} />
                      ))}

                    {/* If no details, show the child order itself */}
                    {(!childDetails || childDetails.length === 0) && (
                      <div className='flex items-center space-x-2 p-1.5 bg-slate-50 rounded-md'>
                        <div className='h-9 w-9 rounded-md bg-white border border-slate-200 flex items-center justify-center overflow-hidden'>
                          <Box className='h-5 w-5 text-blue-400' />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='text-xs font-medium truncate'>{childOrder.recipientName}</div>
                          <div className='flex justify-between text-xs text-slate-500'>
                            <span className='truncate max-w-[200px]'>{childOrder.shippingAddress}</span>
                            <span className='font-medium'>{formatCurrency(childOrder.totalPrice)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

            {/* Handle order details directly */}
            {hasOrderDetails && !hasChildren && order.orderDetails && (
              <div className='space-y-1.5'>
                {order.orderDetails.map((detail, index) => (
                  <OrderDetailItem key={detail.id || `detail-${index}`} detail={detail} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Component to display a single order detail item
function OrderDetailItem({ detail }: { detail: IOrderDetail }) {
  return (
    <div className='flex items-center space-x-2 p-1.5 bg-slate-50 rounded-md'>
      <div className='h-9 w-9 rounded-md bg-white border border-slate-200 flex items-center justify-center overflow-hidden'>
        <Box className='h-5 w-5 text-blue-400' />
      </div>
      <div className='flex-1 min-w-0'>
        <div className='text-xs font-medium truncate'>{detail.productName || 'Product'}</div>
        <div className='flex justify-between text-xs text-slate-500'>
          <span>
            {detail.classificationName && <span className='italic mr-1'>{detail.classificationName}</span>}x
            {detail.quantity || 1}
          </span>
          <span className='font-medium'>{formatCurrency(detail.totalPrice || detail.subTotal || 0)}</span>
        </div>
      </div>
    </div>
  )
}
