import { useQuery } from '@tanstack/react-query'
import {
  CheckCircle2,
  CircleDashed,
  CircleMinus,
  Clock,
  MapPin,
  Package,
  PackageCheck,
  ShoppingCart,
  XCircle
} from 'lucide-react'
import { ElementRef, forwardRef, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { getAllChildOrderListApi } from '@/network/apis/order'
import { IOrder } from '@/types/order'
import { minifyStringId } from '@/utils/string'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { InputProps } from '../ui/input'
import { TOption } from '../ui/react-select'
import AsyncSelect from '../ui/react-select/AsyncSelect'

// Format status by removing underscores and capitalizing words
function formatStatus(status: string): string {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// Get the styling properties for different status types
function getStatusProps(status: string) {
  let bgColor = 'bg-gray-100 text-gray-600'
  let icon = <CircleDashed className='h-3 w-3' />

  switch (status) {
    case 'COMPLETED':
      bgColor = 'bg-green-100 text-green-600'
      icon = <CheckCircle2 className='h-3 w-3' />
      break
    case 'DELIVERING':
      bgColor = 'bg-blue-100 text-blue-600'
      icon = <PackageCheck className='h-3 w-3' />
      break
    case 'WAITING':
      bgColor = 'bg-amber-100 text-amber-600'
      icon = <Clock className='h-3 w-3' />
      break
    case 'CANCELLED':
      bgColor = 'bg-red-100 text-red-600'
      icon = <XCircle className='h-3 w-3' />
      break
    case 'REFUNDED':
      bgColor = 'bg-gray-100 text-gray-600'
      icon = <CircleMinus className='h-3 w-3' />
      break
    // Add any other statuses as needed
    default:
      break
  }

  return {
    bgColor,
    icon
  }
}

// Basic order item interface for better typing
interface BasicOrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

// Extended order interface with proper typing
export interface ExtendedOrder {
  id: string
  children?: BasicOrderItem[]
  orderDetails?: BasicOrderItem[]
  totalPrice: number
  status?: string
  createdAt?: string
  customerName?: string
  deliveryAddress?: string
  shippingAddress?: string
}

interface Props extends Omit<InputProps, 'value' | 'onChange'> {
  onChange?: (value: ExtendedOrder | ExtendedOrder[] | null) => void
  value?: ExtendedOrder | ExtendedOrder[] | null
  multiple?: boolean
}

// Create the SelectOrder component with proper ref
const SelectOrder = forwardRef<ElementRef<typeof AsyncSelect>, Props>((props, ref) => {
  const { t } = useTranslation()
  const { placeholder = 'Select an order', className, onChange, value, multiple = false } = props

  // Function to render order item display with translations
  const getOrderItemDisplay = (order: IOrder) => {
    // Cast to extended type with proper typing
    const extendedOrder = order as ExtendedOrder

    // Get order status for display
    const status = extendedOrder?.status || 'PENDING'

    // Format status for display
    const displayStatus = formatStatus(status)

    // Get status styling
    const statusProps = getStatusProps(status)

    // Get address from deliveryAddress or shippingAddress
    const address = extendedOrder.deliveryAddress || extendedOrder.shippingAddress || ''

    // Get total amount from totalPrice field
    const total = typeof extendedOrder.totalPrice === 'number' ? extendedOrder.totalPrice : 0

    // Use children field if available, otherwise try orderDetails
    const orderItems = extendedOrder.children || extendedOrder.orderDetails || []

    // Check if there are order items
    const hasOrderItems = Array.isArray(orderItems) && orderItems.length > 0

    return (
      <div className='flex items-center gap-2 py-1 w-full'>
        {/* Order Icon with ID */}
        <div className='flex-shrink-0 w-6 h-6 rounded-full bg-blue-100/50 flex items-center justify-center text-blue-500'>
          <ShoppingCart className='h-3.5 w-3.5' />
        </div>

        {/* Order ID */}
        <div className='font-medium text-sm whitespace-nowrap'>{minifyStringId(extendedOrder?.id)}</div>

        {/* Status Badge - styled like ProductsTableColumns */}
        <Badge variant='outline' className={`${statusProps.bgColor} gap-1 h-5 px-1.5 py-0`}>
          {statusProps.icon}
          <span className='whitespace-nowrap text-xs'>{displayStatus}</span>
        </Badge>

        {/* Address information */}
        {address && (
          <div className='flex items-center gap-1 text-gray-500 max-w-[100px] sm:max-w-[150px] md:max-w-[200px]'>
            <MapPin className='h-3 w-3 flex-shrink-0' />
            <span className='text-xs truncate' title={address}>
              {address}
            </span>
          </div>
        )}

        {/* Spacer to push remaining items to right */}
        <div className='flex-grow'></div>

        {/* Product Thumbnails with better fallbacks */}
        {hasOrderItems && (
          <div className='flex -space-x-1.5 mr-2'>
            {orderItems.slice(0, 2).map((item: BasicOrderItem, index) => {
              // Try to get the product name from different possible structures
              const productName = item.name || `Item ${index + 1}`

              return (
                <Avatar key={index} className='w-5 h-5 border border-white'>
                  <AvatarImage src={item.image} alt={productName} className='bg-transparent' />
                  <AvatarFallback className='bg-gray-50 text-gray-500 p-0.5'>
                    <Package size={12} />
                  </AvatarFallback>
                </Avatar>
              )
            })}
            {orderItems.length > 2 && (
              <div className='w-5 h-5 rounded-full border border-white bg-gray-100 flex items-center justify-center text-xs'>
                <span className='text-gray-500 text-[10px] font-medium'>+{orderItems.length - 2}</span>
              </div>
            )}
          </div>
        )}

        {/* Price formatted with translation */}
        <div className='text-xs font-semibold whitespace-nowrap'>{t('productCard.price', { price: total })}</div>
      </div>
    )
  }

  const { data: orderList, isFetching: isGettingOrderList } = useQuery({
    queryKey: [getAllChildOrderListApi.queryKey],
    queryFn: getAllChildOrderListApi.fn
  })

  const orderOptions = useMemo(() => {
    if (!orderList) return []
    return orderList?.data
      .filter(() => true)
      .map((order) => ({
        value: order.id,
        label: minifyStringId(order.id),
        display: getOrderItemDisplay(order)
      }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderList, t]) // Add t to dependencies since it's used in getOrderItemDisplay

  const selectedOptions = useMemo(() => {
    if (multiple) {
      if (!value) return []
      const selectedValues = Array.isArray(value) ? value : [value]
      return selectedValues
        .map((selectedValue) => {
          const order = orderList?.data.find((order) => order.id === selectedValue.id)
          if (!order) return null
          return {
            value: order.id,
            label: minifyStringId(order.id),
            display: getOrderItemDisplay(order)
          }
        })
        .filter(Boolean)
    } else {
      if (!value) return null
      const selectedId = typeof value === 'string' ? value : (value as ExtendedOrder).id
      const order = orderList?.data.find((order) => order.id === selectedId)
      if (!order) return null
      return {
        value: order.id,
        label: minifyStringId(order.id),
        display: getOrderItemDisplay(order)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, orderList?.data, multiple, t]) // Add t to dependencies

  // Add promiseOptions for filtering like in SelectTransaction
  const promiseOptions = useCallback(
    (inputValue: string): Promise<TOption[]> => {
      if (!inputValue) {
        return Promise.resolve(orderOptions) // Return all if no input
      }
      const lowerInputValue = inputValue.toLowerCase().trim()
      // Filter based on the simple label (minified ID)
      const filtered = orderOptions.filter((option) => option.label?.toLowerCase().includes(lowerInputValue))
      return Promise.resolve(filtered)
    },
    [orderOptions]
  )

  return (
    <AsyncSelect
      ref={ref}
      cacheOptions
      defaultOptions={orderOptions}
      loadOptions={promiseOptions}
      isMulti={multiple}
      placeholder={placeholder}
      className={className}
      isLoading={isGettingOrderList}
      isClearable
      value={selectedOptions}
      onChange={(options) => {
        if (multiple) {
          const optionValues = options as TOption[]
          if (onChange) {
            // Filter out orders that don't exist
            const selectedOrders = optionValues
              .map((option) => {
                const order = orderList?.data.find((order) => order.id === option.value)
                return order as ExtendedOrder | undefined
              })
              .filter(Boolean) as ExtendedOrder[]
            onChange(selectedOrders.length > 0 ? selectedOrders : null)
          }
        } else {
          const optionValue = options as TOption | null
          if (onChange) {
            if (!optionValue) {
              onChange(null)
              return
            }
            const selectedOrder = orderList?.data.find((order) => order.id === optionValue?.value)
            onChange((selectedOrder as ExtendedOrder) || null)
          }
        }
      }}
    />
  )
})

SelectOrder.displayName = 'SelectOrder'

export default SelectOrder
