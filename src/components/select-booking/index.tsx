import { useQuery } from '@tanstack/react-query'
import { ChangeEvent, forwardRef, HTMLAttributes, useMemo } from 'react'

import { getAllBookingsApi } from '@/network/apis/booking'
import { TBooking } from '@/types/booking'

import { InputProps } from '../ui/input'
import { TOption } from '../ui/react-select'
import AsyncSelect from '../ui/react-select/AsyncSelect'

type Props = HTMLAttributes<HTMLSelectElement> & InputProps

const getItemDisplay = (booking: TBooking) => {
  return (
    <div className='flex items-center gap-1'>
      <span>{booking.id}</span>
    </div>
  )
}

const SelectBooking = forwardRef<HTMLSelectElement, Props>((props) => {
  const { placeholder = 'Select a booking', className, onChange, value, multiple = false } = props

  const { data: myBookingList, isFetching: isGettingMyBookingList } = useQuery({
    queryKey: [getAllBookingsApi.queryKey],
    queryFn: getAllBookingsApi.fn
  })

  const bookingOptions = useMemo(() => {
    if (!myBookingList) return []
    return myBookingList?.data
      .filter(() => true)
      .map((booking) => ({
        value: booking.id,
        label: booking.id,
        display: getItemDisplay(booking)
      }))
  }, [myBookingList])

  const selectedOptions = useMemo(() => {
    if (multiple) {
      if (!value) return []
      const options = value as string[]
      return options.map((option) => {
        const booking = myBookingList?.data.find((booking) => booking.id === option)
        return {
          value: booking?.id,
          label: booking?.id,
          display: getItemDisplay(booking as TBooking)
        }
      })
    } else {
      if (!value) return null
      const booking = myBookingList?.data.find((booking) => booking.id === value)
      return {
        value: booking?.id,
        label: booking?.id,
        display: getItemDisplay(booking as TBooking)
      }
    }
  }, [value, myBookingList?.data, multiple])

  return (
    <AsyncSelect
      defaultOptions={bookingOptions}
      isMulti={multiple}
      placeholder={placeholder}
      className={className}
      isLoading={isGettingMyBookingList}
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

SelectBooking.displayName = 'SelectBooking'

export default SelectBooking
