import { useQuery } from '@tanstack/react-query'
import { ChangeEvent, forwardRef, HTMLAttributes, useMemo } from 'react'

import { getAllOrderListApi } from '@/network/apis/order'
import { IOrder } from '@/types/order'
import { minifyString } from '@/utils/string'

import { InputProps } from '../ui/input'
import { TOption } from '../ui/react-select'
import AsyncSelect from '../ui/react-select/AsyncSelect'

type Props = HTMLAttributes<HTMLSelectElement> & InputProps

const getOrderItemDisplay = (order: IOrder) => {
  return (
    <div className='flex items-center gap-1'>
      <span>{minifyString(order?.id)}</span>
    </div>
  )
}

const SelectOrder = forwardRef<HTMLSelectElement, Props>((props) => {
  const { placeholder = 'Select a order', className, onChange, value, multiple = false } = props

  const { data: orderList, isFetching: isGettingOrderList } = useQuery({
    queryKey: [getAllOrderListApi.queryKey],
    queryFn: getAllOrderListApi.fn
  })

  const orderOptions = useMemo(() => {
    if (!orderList) return []
    return orderList?.data
      .filter(() => true)
      .map((order) => ({
        value: order.id,
        label: order.id,
        display: getOrderItemDisplay(order)
      }))
  }, [orderList])

  const selectedOptions = useMemo(() => {
    if (multiple) {
      if (!value) return []
      const options = value as string[]
      return options.map((option) => {
        const order = orderList?.data.find((order) => order.id === option)
        return {
          value: order?.id,
          label: order?.id,
          display: getOrderItemDisplay(order as IOrder)
        }
      })
    } else {
      if (!value) return null
      const order = orderList?.data.find((order) => order.id === value)
      return {
        value: order?.id,
        label: order?.id,
        display: getOrderItemDisplay(order as IOrder)
      }
    }
  }, [value, orderList?.data, multiple])

  return (
    <AsyncSelect
      defaultOptions={orderOptions}
      isMulti={multiple}
      placeholder={placeholder}
      className={className}
      isLoading={isGettingOrderList}
      isClearable
      value={selectedOptions}
      onChange={(options) => {
        if (multiple) {
          const optionValues = options as TOption[]
          if (onChange) onChange(optionValues.map((option) => option.value) as unknown as ChangeEvent<HTMLInputElement>)
        } else {
          const optionValues = options as TOption
          if (onChange) onChange(optionValues?.value as unknown as ChangeEvent<HTMLInputElement>)
        }
      }}
    />
  )
})

SelectOrder.displayName = 'SelectOrder'

export default SelectOrder
