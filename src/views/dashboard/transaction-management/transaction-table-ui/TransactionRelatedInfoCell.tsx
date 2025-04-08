import { ChevronDown, ChevronUp, CreditCard, Package, Receipt } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TTransaction } from '@/types/transaction'
import { formatCurrency } from '@/utils/number'
import { minifyString } from '@/utils/string'

interface TransactionRelatedInfoCellProps {
  transaction: TTransaction
}

export function TransactionRelatedInfoCell({ transaction }: TransactionRelatedInfoCellProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Determine what related entities we have
  const hasOrder = !!transaction.order?.id
  const hasBooking = !!transaction.booking?.id

  // If no related entities, show a placeholder
  if (!hasOrder && !hasBooking) {
    return <div className='text-sm text-muted-foreground'>No related items</div>
  }

  // Mock product data for visualization. In real app, you would get this from the transaction
  const mockOrderItems = hasOrder
    ? [
        { id: '1', name: 'Skin Care Product', price: 59.99, imageUrl: '/mock-product-1.jpg' },
        { id: '2', name: 'Anti-Aging Cream', price: 89.99, imageUrl: '/mock-product-2.jpg' }
      ]
    : []

  const mockBookingServices = hasBooking
    ? [{ id: '1', name: 'Facial Treatment', price: 129.99, duration: '60 min', imageUrl: '/mock-service-1.jpg' }]
    : []

  const toggleDetails = () => setShowDetails(!showDetails)

  const renderOrderSummary = () => {
    if (!hasOrder) return null

    const total = mockOrderItems.reduce((sum, item) => sum + item.price, 0)

    return (
      <div className='flex flex-col'>
        <div className='flex items-start space-x-2'>
          <div className='flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-50 text-blue-600 rounded-md'>
            <Receipt className='h-3.5 w-3.5' />
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center justify-between'>
              <span className='font-semibold text-sm'>Order</span>
              <Badge variant='outline' className='text-xs bg-blue-50 text-blue-700 border-blue-200'>
                #{minifyString(transaction.order!.id)}
              </Badge>
            </div>
            <div className='flex items-center mt-1 text-xs text-slate-500'>
              <span className='font-medium'>{mockOrderItems.length} items</span>
              <span className='mx-1.5'>•</span>
              <span className='font-semibold text-slate-700'>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className='mt-2 ml-8 space-y-2 border-l-2 border-blue-100 pl-3'>
            {mockOrderItems.map((item) => (
              <div key={item.id} className='flex items-center space-x-2'>
                <div className='h-8 w-8 rounded-md bg-slate-100 flex items-center justify-center overflow-hidden'>
                  <div className='bg-gradient-to-br from-blue-50 to-slate-100 h-full w-full flex items-center justify-center'>
                    <Package className='h-4 w-4 text-blue-400' />
                  </div>
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='text-xs font-medium truncate'>{item.name}</div>
                  <div className='text-xs text-slate-500'>{formatCurrency(item.price)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderBookingSummary = () => {
    if (!hasBooking) return null

    const total = mockBookingServices.reduce((sum, service) => sum + service.price, 0)

    return (
      <div className='flex flex-col mt-2'>
        <div className='flex items-start space-x-2'>
          <div className='flex-shrink-0 flex items-center justify-center w-6 h-6 bg-purple-50 text-purple-600 rounded-md'>
            <CreditCard className='h-3.5 w-3.5' />
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center justify-between'>
              <span className='font-semibold text-sm'>Booking</span>
              <Badge variant='outline' className='text-xs bg-purple-50 text-purple-700 border-purple-200'>
                #{minifyString(transaction.booking!.id)}
              </Badge>
            </div>
            <div className='flex items-center mt-1 text-xs text-slate-500'>
              <span className='font-medium'>{mockBookingServices.length} services</span>
              <span className='mx-1.5'>•</span>
              <span className='font-semibold text-slate-700'>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className='mt-2 ml-8 space-y-2 border-l-2 border-purple-100 pl-3'>
            {mockBookingServices.map((service) => (
              <div key={service.id} className='flex items-center space-x-2'>
                <div className='h-8 w-8 rounded-md bg-slate-100 flex items-center justify-center overflow-hidden'>
                  <div className='bg-gradient-to-br from-purple-50 to-slate-100 h-full w-full flex items-center justify-center'>
                    <CreditCard className='h-4 w-4 text-purple-400' />
                  </div>
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='text-xs font-medium truncate'>{service.name}</div>
                  <div className='flex text-xs text-slate-500'>
                    <span>{formatCurrency(service.price)}</span>
                    <span className='mx-1'>•</span>
                    <span>{service.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className='w-full'>
      <div className='flex flex-col'>
        {renderOrderSummary()}
        {renderBookingSummary()}
      </div>

      <Button
        variant='ghost'
        size='sm'
        onClick={toggleDetails}
        className='mt-1 h-6 text-xs w-full border-t border-slate-100 hover:bg-slate-50 rounded-none'
      >
        {showDetails ? (
          <>
            <ChevronUp className='h-3 w-3 mr-1' /> Hide details
          </>
        ) : (
          <>
            <ChevronDown className='h-3 w-3 mr-1' /> Show details
          </>
        )}
      </Button>
    </div>
  )
}
