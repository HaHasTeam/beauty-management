import { useQuery } from '@tanstack/react-query'
import { Image } from 'lucide-react'
import { forwardRef, HTMLAttributes, useCallback, useEffect, useMemo } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getProductApi } from '@/network/apis/product'
import { TFile } from '@/types/file'
import { ProductClassificationTypeEnum } from '@/types/product'

import { InputProps } from '../ui/input'
import { TOption } from '../ui/react-select'
import AsyncSelect from '../ui/react-select/AsyncSelect'

export type TClassificationItem = {
  id?: string
  title: string
  price: number
  quantity: number
  sku?: string
  images: TFile[]
  type: ProductClassificationTypeEnum
  color?: string | null
  size?: string | null
  other?: string | null
  originalClassification?: string
}

type Props = Omit<HTMLAttributes<HTMLSelectElement>, 'value'> &
  Omit<InputProps, 'value'> & {
    productId: string
  } & {
    multiple?: false
    value?: TClassificationItem
    onChange?: (value: TClassificationItem) => void
    initialClassification?: Partial<TClassificationItem>
  }

const getItemDisplay = (classification: TClassificationItem) => {
  const imgUrl = classification?.images?.[0]?.fileUrl
  return (
    <div className='flex items-center gap-1'>
      <Avatar className='bg-transparent size-5'>
        <AvatarImage src={imgUrl} />
        <AvatarFallback className='bg-transparent'>
          <Image className='size-4' />
        </AvatarFallback>
      </Avatar>
      <span>{classification?.title || 'Classification'}</span>
    </div>
  )
}

const SelectClassification = forwardRef<HTMLSelectElement, Props>((props) => {
  const {
    placeholder = 'Select a classification',
    className,
    onChange,
    value,
    productId,
    initialClassification
  } = props

  // Fetch product data including its classifications
  const { data: product, isFetching: isGettingProduct } = useQuery({
    queryKey: [getProductApi.queryKey, productId],
    queryFn: getProductApi.fn,
    enabled: !!productId
  })

  // Extract classifications from product data
  const classificationList = useMemo(() => product?.data?.productClassifications || [], [product])

  // Transform to options for select dropdown
  const classificationOptions = useMemo(() => {
    return classificationList.map((classification) => ({
      value: classification.id,
      label: classification.title,
      display: getItemDisplay(classification as TClassificationItem)
    }))
  }, [classificationList])

  // Find the currently selected option
  const selectedOptions = useMemo(() => {
    // If no value or incomplete value, return undefined
    if (!value || !value.title) return undefined

    // Find the matching classification
    const selectedClassification = classificationList.find((item) => {
      // Match by title or id/originalClassification
      if (value.title) {
        return item.title === value.title
      }
      // Fallback to id matching
      return item.id === (value.originalClassification || value.id)
    })

    // If we found a match, return the option
    if (selectedClassification?.id) {
      return classificationOptions.find((opt) => opt.value === selectedClassification.id)
    }

    return undefined
  }, [value, classificationList, classificationOptions])

  // Calculate maximum quantity based on initialClassification
  const maxQuantity = useMemo(() => {
    // Find current classification
    const currentClassification = classificationList.find((item) => {
      if (value?.title) {
        return item.title === value.title
      }
      return item.id === (value?.originalClassification || value?.id)
    })

    // Handle quantity limit calculation
    if (initialClassification?.id && currentClassification) {
      // If this is the same classification that was initially selected
      if (initialClassification.title === currentClassification.title) {
        // Return the maximum available quantity
        return currentClassification.quantity ?? 0
      }
      // Otherwise just return the available quantity
      return currentClassification.quantity ?? 0
    }

    // Default to current classification quantity
    return currentClassification?.quantity ?? 0
  }, [initialClassification, value, classificationList])

  // Update quantity when maxQuantity changes
  useEffect(() => {
    if (onChange && value && (maxQuantity ?? 0) > 0) {
      onChange({
        ...value,
        quantity: maxQuantity ?? 0
      })
    }
  }, [maxQuantity, onChange, value])

  // Helper function to check if a classification matches the initial one
  const isInitialClassification = (classification: TClassificationItem) => {
    if (!initialClassification?.id) return false
    return classification.id === initialClassification.id
  }

  // Helper function to generate a shorter SKU
  const generateShortSku = (originalSku: string | undefined) => {
    if (!originalSku) return ''

    // Extract first 3-5 characters from the original SKU
    const prefix = originalSku.substring(0, Math.min(5, originalSku.length))
    // Get last 4 digits of timestamp
    const timestamp = new Date().getTime().toString().slice(-4)

    return `${prefix}-${timestamp}`
  }

  // Auto-select the only classification if there's just one
  useEffect(() => {
    if (classificationList.length === 1 && !value?.id && onChange) {
      const classification = classificationList[0] as TClassificationItem
      const formValue: TClassificationItem = {
        ...(value || {}),
        title: classification.title,
        price: classification.price,
        type: classification.type,
        images: classification.images.map((image) => ({
          ...image,
          name: image.name ?? image.fileUrl,
          fileUrl: image.fileUrl
        })),
        quantity: maxQuantity ?? 0,
        sku: generateShortSku(value?.sku || classification.sku),
        originalClassification: classification.id,
        color: classification.color,
        size: classification.size,
        other: classification.other
      }
      onChange(formValue)
    }
  }, [classificationList.length, value, onChange, maxQuantity, classificationList])

  // Filter options based on search input
  const loadOptions = useCallback(
    async (inputValue: string) => {
      // If no product ID, return empty array
      if (!productId) {
        return Promise.resolve([])
      }

      // If no input, return all options
      if (!inputValue) {
        return Promise.resolve(classificationOptions)
      }

      // Filter options based on input
      const filteredOptions = classificationOptions.filter((option) =>
        option.label?.toLowerCase().includes(inputValue.toLowerCase())
      )

      return Promise.resolve(filteredOptions)
    },
    [productId, classificationOptions]
  )

  return (
    <AsyncSelect
      key={productId} // Key based solely on productId to force re-render when product changes
      cacheOptions={false} // Disable caching to ensure fresh options on each render
      defaultOptions={classificationOptions}
      loadOptions={loadOptions}
      value={selectedOptions}
      isMulti={false}
      placeholder={placeholder}
      className={className}
      isLoading={isGettingProduct}
      isClearable
      isSearchable
      onChange={(options) => {
        if (!options) {
          // Handle clearing selection
          if (onChange) {
            // Create an empty classification item
            const emptyValue: TClassificationItem = {
              title: '',
              price: 0,
              quantity: 0,
              type: ProductClassificationTypeEnum.DEFAULT,
              images: [],
              originalClassification: ''
            }
            onChange(emptyValue)
          }
          return
        }

        // Get the selected option value
        const optionValue = (options as TOption).value

        // Find the matching classification
        const classification = classificationList.find((item) => item.id === optionValue) as TClassificationItem

        // If no matching classification, do nothing
        if (!classification) return

        // Check if this is the initial classification
        const isInitial = isInitialClassification(classification)

        // Create form value from the selected classification
        const formValue: TClassificationItem = {
          ...(value || {}), // Preserve existing values
          id: classification.id,
          title: classification.title,
          price: isInitial ? (initialClassification?.price ?? classification.price) : classification.price,
          type: classification.type,
          images: classification.images.map((image) => ({
            ...image,
            name: image.name ?? image.fileUrl,
            fileUrl: image.fileUrl
          })),
          quantity: maxQuantity ?? 0, // Always use maxQuantity for the quantity field
          sku: isInitial
            ? (initialClassification?.sku ?? generateShortSku(classification.sku))
            : generateShortSku(classification.sku),
          originalClassification: classification.id,
          color: classification.color,
          size: classification.size,
          other: classification.other
        }

        // Call onChange with the new value
        if (onChange) {
          onChange(formValue)
        }
      }}
    />
  )
})

SelectClassification.displayName = 'SelectClassification'

export default SelectClassification
