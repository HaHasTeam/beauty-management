import { Box, ChevronDown, ChevronUp, CreditCard, Info, Package, ShoppingBag, Ticket } from 'lucide-react'
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

  // Get child orders count
  const childOrdersCount = hasChildren ? order.children?.length || 0 : 0

  // Also check for orderDetails (may be present in some orders)
  const hasOrderDetails = order.orderDetails && order.orderDetails.length > 0

  // Check for vouchers - make sure they exist and are greater than 0
  const platformVoucher = order.platformVoucherDiscount || 0
  const shopVoucher = order.shopVoucherDiscount || 0
  const hasPlatformVoucher = platformVoucher > 0
  const hasShopVoucher = shopVoucher > 0

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
        <div className='flex items-start space-x-2'>
          <div className='flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-50 text-blue-600 rounded-md mt-1'>
            <ShoppingBag className='h-3.5 w-3.5' />
          </div>

          <div className='flex-1'>
            <div className='flex items-center justify-between'>
              <div className='text-sm'>
                Order <span className='font-bold'>{totalItems}</span> item{totalItems !== 1 ? 's' : ''} with{' '}
                <span className='font-bold'>{formatCurrency(order.totalPrice)}</span> in total
                {hasChildren && (
                  <span className='ml-2 text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium'>
                    {childOrdersCount} child order{childOrdersCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <Button variant='ghost' size='sm' className='h-7 px-2 flex-shrink-0' onClick={toggleExpanded}>
                {expanded ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
              </Button>
            </div>

            {/* Voucher information - only show when actual discounts exist */}
            {(hasPlatformVoucher || hasShopVoucher) && (
              <div className='flex flex-wrap gap-3 mt-1 text-xs'>
                {hasPlatformVoucher && (
                  <div className='flex items-center gap-1'>
                    <Ticket className='h-3.5 w-3.5 text-indigo-500' />
                    <div>
                      <span className='text-indigo-600 font-medium'>Platform voucher:</span>
                      <span className='ml-1 text-indigo-600'>-{formatCurrency(platformVoucher)}</span>
                    </div>
                  </div>
                )}

                {hasShopVoucher && (
                  <div className='flex items-center gap-1'>
                    <CreditCard className='h-3.5 w-3.5 text-emerald-500' />
                    <div>
                      <span className='text-emerald-600 font-medium'>Shop voucher:</span>
                      <span className='ml-1 text-emerald-600'>-{formatCurrency(shopVoucher)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {expanded && (
          <div className='mt-2 space-y-2 pl-8'>
            {/* Handle child orders */}
            {hasChildren &&
              order.children?.map((childOrder, index) => (
                <ChildOrderItem key={childOrder.id || index} childOrder={childOrder} index={index} level={1} />
              ))}

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

// Component to display a single child order (which might have its own children)
function ChildOrderItem({ childOrder, index, level = 1 }: { childOrder: IOrder; index: number; level?: number }) {
  const [expanded, setExpanded] = useState(false)
  const hasNestedChildren = childOrder.children && childOrder.children.length > 0
  const hasOrderDetails = childOrder.orderDetails && childOrder.orderDetails.length > 0

  // Get count of nested children
  const nestedChildrenCount = hasNestedChildren ? childOrder.children?.length || 0 : 0

  // Make sure vouchers are greater than 0 to display them
  const platformVoucher = childOrder.platformVoucherDiscount || 0
  const shopVoucher = childOrder.shopVoucherDiscount || 0
  const hasPlatformVoucher = platformVoucher > 0
  const hasShopVoucher = shopVoucher > 0

  // Styling adjustments for nested levels
  const bgColor = level === 1 ? 'bg-slate-50' : level === 2 ? 'bg-white' : 'bg-slate-50'
  const borderStyle = level === 1 ? 'border-slate-200' : level === 2 ? 'border-slate-100' : 'border-slate-200'
  const headerBg = level === 1 ? 'bg-slate-100' : level === 2 ? 'bg-slate-50' : 'bg-white'

  return (
    <div className={`space-y-1.5 rounded-md border ${borderStyle} overflow-hidden ${bgColor}`}>
      <div className={`flex items-center justify-between px-2 py-1 ${headerBg}`}>
        <div className='flex items-center space-x-2'>
          <div className='flex-shrink-0 flex items-center justify-center w-5 h-5 bg-blue-50 text-blue-600 rounded-md'>
            <Package className='h-3 w-3' />
          </div>
          <div className='text-xs font-medium'>
            {level > 1 ? 'Sub-' : ''}Package {index + 1} - {formatCurrency(childOrder.totalPrice)}
            {hasNestedChildren && (
              <span className='ml-2 text-xs bg-blue-50 text-blue-600 px-1 py-0 rounded-full'>
                {nestedChildrenCount} sub-order{nestedChildrenCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        <div className='flex items-center gap-2'>
          {/* Platform Voucher - only show if greater than 0 */}
          {hasPlatformVoucher && (
            <div className='flex items-center gap-1'>
              <Ticket className='h-3 w-3 text-indigo-500' />
              <span className='text-xs text-indigo-600'>-{formatCurrency(platformVoucher)}</span>
            </div>
          )}

          {/* Shop Voucher - only show if greater than 0 */}
          {hasShopVoucher && (
            <div className='flex items-center gap-1'>
              <CreditCard className='h-3 w-3 text-emerald-500' />
              <span className='text-xs text-emerald-600'>-{formatCurrency(shopVoucher)}</span>
            </div>
          )}

          {(hasNestedChildren || hasOrderDetails) && (
            <Button variant='ghost' size='sm' className='h-5 w-5 p-0' onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className='h-3 w-3' /> : <ChevronDown className='h-3 w-3' />}
            </Button>
          )}
        </div>
      </div>

      {/* Main order info */}
      <div className='px-2 pb-2'>
        <div className='flex items-center space-x-2 p-1.5 bg-white rounded-md'>
          <div className='h-8 w-8 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden'>
            <Box className='h-4 w-4 text-blue-400' />
          </div>
          <div className='flex-1 min-w-0'>
            <div className='text-xs font-medium truncate'>{childOrder.recipientName}</div>
            <div className='flex justify-between text-xs text-slate-500'>
              <span className='truncate max-w-[200px]'>{childOrder.shippingAddress}</span>
              <span className='font-medium'>{formatCurrency(childOrder.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Expanded content - either nested children or order details */}
        {expanded && (
          <div className='mt-2 space-y-2 pl-4'>
            {/* Handle nested children */}
            {hasNestedChildren &&
              childOrder.children?.map((nestedChild, nestedIndex) => (
                <ChildOrderItem
                  key={nestedChild.id || `nested-${nestedIndex}`}
                  childOrder={nestedChild}
                  index={nestedIndex}
                  level={level + 1}
                />
              ))}

            {/* Handle order details */}
            {hasOrderDetails &&
              childOrder.orderDetails?.map((detail, detailIndex) => (
                <OrderDetailItem key={detail.id || `detail-${detailIndex}`} detail={detail} />
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Component to display a single order detail item
function OrderDetailItem({ detail }: { detail: IOrderDetail }) {
  return (
    <div className='flex items-center space-x-2 p-1.5 bg-white rounded-md'>
      <div className='h-8 w-8 rounded-md bg-white border border-slate-200 flex items-center justify-center overflow-hidden'>
        <Box className='h-4 w-4 text-blue-400' />
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
