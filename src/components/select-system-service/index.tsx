import { useQuery } from '@tanstack/react-query'
import { Image } from 'lucide-react'
import { ChangeEvent, forwardRef, HTMLAttributes, useCallback, useMemo } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getAllSystemServiceApi } from '@/network/apis/system-service'
import { ISystemService } from '@/types/system-service'

import { InputProps } from '../ui/input'
import { TOption } from '../ui/react-select'
import AsyncSelect from '../ui/react-select/AsyncSelect'

type Props = HTMLAttributes<HTMLSelectElement> & InputProps

const getServiceItemDisplay = (service: ISystemService) => {
  const imgUrl = service.images?.[0]?.fileUrl || ''
  return (
    <div className='flex items-center gap-1'>
      <Avatar className='bg-transparent size-5'>
        <AvatarImage src={imgUrl} />
        <AvatarFallback className='bg-transparent'>
          <Image className='size-4' />
        </AvatarFallback>
      </Avatar>
      <span>{service.name}</span>
    </div>
  )
}

const SelectSystemService = forwardRef<HTMLSelectElement, Props>((props) => {
  const {
    placeholder = 'Select a kind of service',
    className,
    onChange,
    value,
    multiple = false,
    readOnly = false
  } = props

  const { data: systemServiceList, isFetching: isGettingSystemServiceList } = useQuery({
    queryKey: [getAllSystemServiceApi.queryKey],
    queryFn: getAllSystemServiceApi.fn
  })

  const serviceOptions = useMemo(() => {
    if (!systemServiceList) return []
    return systemServiceList?.data.map((service) => ({
      value: service.id,
      label: service.name,
      display: getServiceItemDisplay(service)
    }))
  }, [systemServiceList])

  const selectedOptions = useMemo(() => {
    if (multiple) {
      if (!value) return []
      const options = value as string[]
      return options.map((option) => {
        const service = systemServiceList?.data.find((service) => service.id === option)
        return {
          value: service?.id,
          label: service?.name,
          display: getServiceItemDisplay(service as ISystemService)
        }
      })
    } else {
      if (!value) return null
      const service = systemServiceList?.data.find((service) => service.id === value)
      return {
        value: service?.id,
        label: service?.name,
        display: getServiceItemDisplay(service as ISystemService)
      }
    }
  }, [value, systemServiceList?.data, multiple])

  const promiseOptions = useCallback(
    (inputValue: string) => {
      if (!inputValue) {
        return Promise.resolve(serviceOptions)
      }
      const filteredOptions = serviceOptions.filter((option) =>
        option.label?.toLowerCase().includes(inputValue.toLowerCase())
      )
      return Promise.resolve(filteredOptions)
    },
    [serviceOptions]
  )

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions={serviceOptions}
      loadOptions={promiseOptions}
      value={selectedOptions}
      isMulti={multiple}
      placeholder={placeholder}
      className={className}
      isLoading={isGettingSystemServiceList}
      isClearable
      isSearchable
      isDisabled={readOnly}
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

SelectSystemService.displayName = 'SelectSystemService'

export default SelectSystemService
