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
    readOnly?: boolean
  } & {
    multiple?: false
    value?: TClassificationItem
    onChange?: (value: TClassificationItem) => void
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
  const { placeholder = 'Select a classification', className, onChange, value, productId, readOnly = false } = props

  // Check if the component should be readonly - either explicitly set or when value has ID
  const isReadOnly = readOnly || !!value?.id

  // Fetch product data including its classifications
  const { data: product, isFetching: isGettingProduct } = useQuery({
    queryKey: [getProductApi.queryKey, productId],
    queryFn: getProductApi.fn,
    enabled: !!productId
  })

  // Extract classifications from product data
  const classificationList = useMemo(() => product?.data?.productClassifications || [], [product])

  // Effect to maintain quantity value when the same classification is selected
  useEffect(() => {
    // Skip if conditions not met
    if (!onChange || !value || !value.title) {
      return
    }

    // Skip if value doesn't have an ID (means it's not an existing classification)
    if (!value.id) {
      return
    }

    // Find the matching classification by title
    const matchingClassification = classificationList.find((item) => item.title === value.title)

    // Skip if matching classification not found
    if (!matchingClassification) {
      return
    }

    // If quantity has been changed from the original
    if (value.quantity !== matchingClassification.quantity) {
      // Create a new object with all properties from value, only updating quantity
      const updatedValue: TClassificationItem = {
        ...value,
        quantity: matchingClassification.quantity || 0
      }

      // Update the form value
      onChange(updatedValue)
    }
  }, [value?.title, value?.id, classificationList, onChange, value, isReadOnly])

  // Helper function to generate a shorter SKU
  const generateShortSku = useCallback((originalSku: string | undefined) => {
    if (!originalSku) return ''
    const prefix = originalSku.substring(0, Math.min(5, originalSku.length))
    const timestamp = new Date().getTime().toString().slice(-4)
    return `${prefix}-${timestamp}`
  }, [])
  // Auto-select the only classification if there's just one
  useEffect(() => {
    // Skip if any of these conditions are not met
    if (
      classificationList.length !== 1 || // Only if there's exactly one classification
      !onChange || // Only if we have an onChange handler
      (value && value.title) || // Skip if already has a value
      isReadOnly || // Skip if readonly
      isGettingProduct || // Skip if still loading
      !product?.data // Skip if no product data
    ) {
      return
    }

    // We have exactly one classification and should auto-select it
    const classification = classificationList[0]
    if (classification && classification.id) {
      // Only auto-select once when data is first loaded
      // Construct the same form value as in the onChange handler
      const formValue: TClassificationItem = {
        title: classification.title || '',
        price: typeof classification.price === 'number' ? classification.price : 0,
        type: ProductClassificationTypeEnum.CUSTOM,
        // Cast the images array to TFile[] - we know the API returns compatible data
        images: (classification.images || []) as TFile[],
        quantity: classification.quantity || 0,
        sku: generateShortSku(classification.sku),
        color: classification.color || null,
        size: classification.size || null,
        other: classification.other || null,
        // For auto-select, always use originalClassification
        originalClassification: classification.id
      }

      // Call onChange with the auto-selected value
      onChange(formValue)
    }
  }, [classificationList, onChange, value, isReadOnly, isGettingProduct, product, generateShortSku])

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
      // Match by title
      if (value.title) {
        return item.title === value.title
      }
      return false
    })

    // If we found a match, return the option
    if (selectedClassification?.id) {
      return classificationOptions.find((opt) => opt.value === selectedClassification.id)
    }

    return undefined
  }, [value, classificationList, classificationOptions])

  return (
    <AsyncSelect
      key={productId} // Key based solely on productId to force re-render when product changes
      cacheOptions={false} // Disable caching to ensure fresh options on each render
      defaultOptions={classificationOptions}
      loadOptions={useCallback(
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
      )}
      value={selectedOptions}
      isMulti={false}
      placeholder={placeholder}
      className={className}
      isLoading={isGettingProduct}
      isClearable={false}
      isSearchable={!isReadOnly}
      isDisabled={isReadOnly}
      menuPortalTarget={document.body} // Render dropdown in body to avoid clipping
      styles={{
        menuPortal: (base) => ({
          ...base,
          zIndex: 9999 // Ensure high z-index
        })
      }}
      onChange={(options) => {
        // If readonly, don't allow changes
        if (isReadOnly) return

        if (!options) {
          // Handle clearing selection
          if (onChange) {
            // Create an empty classification item
            const emptyValue: TClassificationItem = {
              title: '',
              price: 0,
              quantity: 0,
              type: ProductClassificationTypeEnum.DEFAULT,
              images: []
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

        // Keep the existing quantity if the classification is the same
        // This prevents resetting quantity when user has modified it
        const isSameClassification = value?.title === classification.title
        const shouldKeepQuantity =
          isSameClassification && value?.quantity !== undefined && value.quantity !== classification.quantity

        // Create form value from the selected classification
        const formValue: TClassificationItem = {
          title: classification.title,
          price: classification.price,
          type: ProductClassificationTypeEnum.CUSTOM,
          images: classification.images.map((image) => ({
            ...image,
            name: image.name ?? image.fileUrl,
            fileUrl: image.fileUrl
          })),
          // Use existing quantity if different from original and is the same classification
          quantity: shouldKeepQuantity ? value!.quantity : classification.quantity || 0,
          sku: generateShortSku(classification.sku),
          color: classification.color,
          size: classification.size,
          other: classification.other
        }

        // Handle ID and originalClassification based on conditions
        if (value?.id) {
          // If value already has an ID, it's a cloned item - keep the ID
          formValue.id = value.id
        } else {
          // Always set the originalClassification to the selected classification's ID
          formValue.originalClassification = classification.id
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
