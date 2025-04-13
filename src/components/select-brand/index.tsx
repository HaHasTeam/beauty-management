import { useQuery } from '@tanstack/react-query'
import { Building } from 'lucide-react'
import { ChangeEvent, forwardRef, HTMLAttributes, useCallback, useMemo } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getAllBrandsApi } from '@/network/apis/brand'
import { TBrand } from '@/types/brand'

import { InputProps } from '../ui/input'
import { TOption } from '../ui/react-select'
import AsyncSelect from '../ui/react-select/AsyncSelect'

type Props = HTMLAttributes<HTMLSelectElement> &
  InputProps & {
    multiple?: boolean
  }

const getBrandItemDisplay = (brand: TBrand) => {
  return (
    <div className='flex items-center gap-1'>
      <Avatar className='bg-transparent size-5'>
        <AvatarImage src={brand?.logo} />
        <AvatarFallback className='bg-transparent'>
          <Building className='size-4' />
        </AvatarFallback>
      </Avatar>
      <span>{brand?.name}</span>
    </div>
  )
}

const SelectBrand = forwardRef<HTMLSelectElement, Props>((props) => {
  const {
    placeholder = props.multiple ? 'Select brands' : 'Select a brand',
    className,
    onChange,
    value,
    multiple = false,
    readOnly = false
  } = props

  const { data: brandList, isFetching: isGettingBrandList } = useQuery({
    queryKey: [getAllBrandsApi.queryKey],
    queryFn: getAllBrandsApi.fn
  })

  const brandOptions = useMemo(() => {
    if (!brandList) return []
    return brandList?.data.map((brand) => ({
      value: brand.id,
      label: brand.name,
      display: getBrandItemDisplay(brand)
    }))
  }, [brandList])

  const selectedOptions = useMemo(() => {
    if (multiple) {
      if (!value) return []
      const options = value as string[]
      return options.map((option) => {
        const brand = brandList?.data.find((brand) => brand.id === option)
        return {
          value: brand?.id,
          label: brand?.name,
          display: getBrandItemDisplay(brand as TBrand)
        }
      })
    } else {
      if (!value) return null
      const brand = brandList?.data.find((brand) => brand.id === value)
      return {
        id: brand?.id,
        value: brand?.id,
        label: brand?.name,
        display: getBrandItemDisplay(brand as TBrand)
      }
    }
  }, [value, brandList?.data, multiple])

  const promiseOptions = useCallback(
    (inputValue: string) => {
      if (!inputValue) {
        return Promise.resolve(brandOptions)
      }

      // Search algorithm focusing on brand name
      const searchTerm = inputValue.toLowerCase().trim()
      const filteredOptions = brandOptions.filter((option) => {
        const label = option.label.toLowerCase()

        // Exact match has highest priority
        if (label === searchTerm) {
          return true
        }

        // Starts with the search term
        if (label.startsWith(searchTerm)) {
          return true
        }

        // Contains the search term as a whole word
        if (label.includes(` ${searchTerm}`) || label.includes(`${searchTerm} `)) {
          return true
        }

        // Contains the search term anywhere
        if (label.includes(searchTerm)) {
          return true
        }

        return false
      })

      return Promise.resolve(filteredOptions)
    },
    [brandOptions]
  )

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions={brandOptions}
      loadOptions={promiseOptions}
      value={selectedOptions}
      isMulti={multiple}
      placeholder={placeholder}
      className={className}
      isLoading={isGettingBrandList}
      isClearable={!readOnly}
      isDisabled={readOnly}
      isSearchable
      onChange={(options) => {
        if (multiple) {
          const optionValues = options as TOption[]
          if (onChange) onChange(optionValues.map((option) => option.value) as unknown as ChangeEvent<HTMLInputElement>)
        } else {
          const optionValues = options as TOption

          // If selection is changed, pass the new value
          if (onChange) {
            // Handle case when nothing is selected (clearing)
            if (!optionValues) {
              onChange('' as unknown as ChangeEvent<HTMLInputElement>)
              return
            }

            onChange(optionValues.value as unknown as ChangeEvent<HTMLInputElement>)
          }
        }
      }}
    />
  )
})
SelectBrand.displayName = 'SelectBrand'

export default SelectBrand
