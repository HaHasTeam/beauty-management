import { Calendar, ChevronDown, ChevronUp, CreditCard, Info, Receipt, ShoppingBag } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { TTransaction } from '@/types/transaction'
import { formatCurrency } from '@/utils/number'
import { minifyString } from '@/utils/string'

interface TransactionReferenceCellProps {
  transaction: TTransaction
}

export function TransactionReferenceCell({ transaction }: TransactionReferenceCellProps) {
  const [expanded, setExpanded] = useState(false)

  // Determine what related entities we have
  const hasOrder = !!transaction.order?.id
  const hasBooking = !!transaction.booking?.id

  // If no related entities, show a placeholder
  if (!hasOrder && !hasBooking) {
    return (
      <div className='flex items-center text-sm text-muted-foreground p-2'>
        <Info className='h-4 w-4 mr-2 text-slate-400' />
        <span className='italic'>N/A</span>
      </div>
    )
  }

  // Use the transaction amount for the total
  const transactionAmount = transaction.amount || 0

  // Mock data for visualization. In a real app, you would get this from the transaction
  // Calculate mock item prices based on transaction amount
  const mockOrderItems = hasOrder
    ? [
        {
          id: '1',
          name: 'Hydrating Face Serum',
          price: transactionAmount * 0.4,
          quantity: 1,
          imageUrl: '/placeholder-product.jpg'
        },
        {
          id: '2',
          name: 'Anti-Aging Night Cream',
          price: transactionAmount * 0.3,
          quantity: 2,
          imageUrl: '/placeholder-product.jpg'
        }
      ]
    : []

  const mockBookingServices = hasBooking
    ? [
        {
          id: '1',
          name: 'Facial Treatment',
          price: transactionAmount * 0.6,
          duration: '60 min',
          imageUrl: '/placeholder-service.jpg'
        },
        {
          id: '2',
          name: 'Hair Styling',
          price: transactionAmount * 0.4,
          duration: '45 min',
          imageUrl: '/placeholder-service.jpg'
        }
      ]
    : []

  // Check if order has discount - in real app, get this from transaction.order
  // Using mock data based on the transaction amount
  const hasDiscount = hasOrder

  // Calculate subtotal from transaction amount (add discount back)
  const discountPercent = 15
  const subtotalBeforeDiscount = hasDiscount ? transactionAmount / (1 - discountPercent / 100) : transactionAmount

  // Calculate items prices based on this subtotal
  if (hasOrder && mockOrderItems.length > 0) {
    const itemsTotal = mockOrderItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
    if (itemsTotal !== subtotalBeforeDiscount) {
      // Adjust the last item's price to make the total match
      const lastItem = mockOrderItems[mockOrderItems.length - 1]
      const difference = subtotalBeforeDiscount - itemsTotal
      lastItem.price = (lastItem.price * lastItem.quantity + difference) / lastItem.quantity
    }
  }

  // Calculate discount amount
  const discountAmount = hasDiscount ? subtotalBeforeDiscount * (discountPercent / 100) : 0

  // The order total should match the transaction amount
  const orderTotal = transactionAmount

  // For booking, use the transaction amount directly
  const bookingTotal = transactionAmount

  const toggleExpanded = () => setExpanded(!expanded)

  return (
    <div className='w-full rounded-md overflow-hidden'>
      {/* Order Reference */}
      {hasOrder && (
        <div className={cn('border-b border-slate-100 p-2', !hasBooking && 'border-b-0')}>
          <div className='flex items-center space-x-2 mb-1.5'>
            <div className='flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-50 text-blue-600 rounded-md'>
              <Receipt className='h-3.5 w-3.5' />
            </div>
            <div className='flex-1 flex items-center justify-between'>
              <span className='font-medium text-sm'>Order Reference</span>
              <div className='flex items-center gap-2'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant='outline' className='text-xs bg-blue-50 text-blue-700 border-blue-200'>
                        {minifyString(transaction.order!.id)}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side='left'>
                      <p className='text-xs'>Order ID: {transaction.order!.id}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {!hasBooking && (
                  <Button variant='ghost' size='sm' className='h-7 px-2 flex-shrink-0' onClick={toggleExpanded}>
                    {expanded ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className='text-xs text-slate-500 flex items-center justify-between mb-1 pl-8'>
            <span>
              <span className='font-medium'>{mockOrderItems.length}</span> items
            </span>
            <div className='flex items-center gap-2'>
              <span className='font-medium text-slate-700'>{formatCurrency(orderTotal)}</span>
              {hasDiscount && (
                <Badge variant='outline' className='text-xs bg-green-50 text-green-700 border-green-200 font-medium'>
                  {discountPercent}% off (-{formatCurrency(discountAmount)})
                </Badge>
              )}
            </div>
          </div>

          {expanded && (
            <div className='mt-2 space-y-2 pl-8'>
              {mockOrderItems.map((item) => (
                <div key={item.id} className='flex items-center space-x-2 p-1.5 bg-slate-50 rounded-md'>
                  <div className='h-9 w-9 rounded-md bg-white border border-slate-200 flex items-center justify-center overflow-hidden'>
                    <ShoppingBag className='h-5 w-5 text-blue-400' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='text-xs font-medium truncate'>{item.name}</div>
                    <div className='flex justify-between text-xs text-slate-500'>
                      <span>
                        {formatCurrency(item.price)} × {item.quantity || 1}
                      </span>
                      <span className='font-medium'>{formatCurrency(item.price * (item.quantity || 1))}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking Reference */}
      {hasBooking && (
        <div className='p-2'>
          <div className='flex items-center space-x-2 mb-1.5'>
            <div className='flex-shrink-0 flex items-center justify-center w-6 h-6 bg-purple-50 text-purple-600 rounded-md'>
              <Calendar className='h-3.5 w-3.5' />
            </div>
            <div className='flex-1 flex items-center justify-between'>
              <span className='font-medium text-sm'>Booking Reference</span>
              <div className='flex items-center gap-2'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant='outline' className='text-xs bg-purple-50 text-purple-700 border-purple-200'>
                        {minifyString(transaction.booking!.id)}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side='left'>
                      <p className='text-xs'>Booking ID: {transaction.booking!.id}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button variant='ghost' size='sm' className='h-7 px-2 flex-shrink-0' onClick={toggleExpanded}>
                  {expanded ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
                </Button>
              </div>
            </div>
          </div>

          <div className='text-xs text-slate-500 flex items-center justify-between mb-1 pl-8'>
            <span>
              <span className='font-medium'>{mockBookingServices.length}</span> services
            </span>
            <span className='font-medium text-slate-700'>{formatCurrency(bookingTotal)}</span>
          </div>

          {expanded && (
            <div className='mt-2 space-y-2 pl-8'>
              {mockBookingServices.map((service) => (
                <div key={service.id} className='flex items-center space-x-2 p-1.5 bg-slate-50 rounded-md'>
                  <div className='h-9 w-9 rounded-md bg-white border border-slate-200 flex items-center justify-center overflow-hidden'>
                    <CreditCard className='h-5 w-5 text-purple-400' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='text-xs font-medium truncate'>{service.name}</div>
                    <div className='flex justify-between text-xs text-slate-500'>
                      <span>{service.duration}</span>
                      <span className='font-medium'>{formatCurrency(service.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
