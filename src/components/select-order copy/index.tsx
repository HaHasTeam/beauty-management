import { useQuery } from '@tanstack/react-query'
import { ChangeEvent, forwardRef, HTMLAttributes, useMemo } from 'react'

import { flattenCategoryApi } from '@/network/apis/category'
import { ICategory } from '@/types/category'

import { InputProps } from '../ui/input'
import { TOption } from '../ui/react-select'
import AsyncSelect from '../ui/react-select/AsyncSelect'

type Props = HTMLAttributes<HTMLSelectElement> &
  InputProps & {
    except?: string[]
  }

const getCategoryItemDisplay = (Category: ICategory) => {
  return (
    <div className='flex items-center gap-1'>
      <span>{Category?.name}</span>
    </div>
  )
}

const SelectCategory = forwardRef<HTMLSelectElement, Props>((props) => {
  const { placeholder = 'Select a category', className, onChange, value, multiple = false, except } = props

  const { data: CategoryList, isFetching: isGettingCategoryList } = useQuery({
    queryKey: [flattenCategoryApi.queryKey],
    queryFn: flattenCategoryApi.fn
  })

  const extraOptions = useMemo(() => {
    return [
      {
        value: '',
        label: 'ROOT',
        display: getCategoryItemDisplay({
          name: 'ROOT'
        } as ICategory)
      }
    ]
  }, [])

  const CategoryOptions = useMemo(() => {
    if (!CategoryList) return []
    const res = CategoryList?.data
      .filter(() => true)
      .map((Category) => ({
        value: Category.id,
        label: Category.id,
        display: getCategoryItemDisplay(Category)
      }))
      .filter((item) => {
        return except ? except?.indexOf(item.value) === -1 : true
      })
    res.unshift(...extraOptions)
    return res
  }, [CategoryList, except, extraOptions])

  const selectedOptions = useMemo(() => {
    if (multiple) {
      if (!value) return []
      const options = value as string[]
      return options.map((option) => {
        const Category = CategoryList?.data.find((Category) => Category.id === option)
        return {
          value: Category?.id,
          label: Category?.name,
          display: getCategoryItemDisplay(Category as ICategory)
        }
      })
    } else {
      if (!value && value !== '') return null
      if (value === '') {
        return {
          value: '',
          label: 'ROOT',
          display: getCategoryItemDisplay({
            name: 'ROOT'
          } as ICategory)
        }
      }
      const Category = CategoryList?.data.find((Category) => Category.id === value)
      return {
        value: Category?.id,
        label: Category?.name,
        display: getCategoryItemDisplay(Category as ICategory)
      }
    }
  }, [value, CategoryList?.data, multiple])

  return (
    <AsyncSelect
      defaultOptions={CategoryOptions}
      isMulti={multiple}
      placeholder={placeholder}
      className={className}
      isLoading={isGettingCategoryList}
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

SelectCategory.displayName = 'SelectCategory'

export default SelectCategory
