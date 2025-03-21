import { useQuery } from '@tanstack/react-query'
import { Image } from 'lucide-react'
import { ChangeEvent, forwardRef, HTMLAttributes, useEffect, useMemo } from 'react'

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
  color?: string
  size?: string
  other?: string
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
  const imgUrl = classification.images[0]?.fileUrl
  return (
    <div className='flex items-center gap-1'>
      <Avatar className='bg-transparent size-5'>
        <AvatarImage src={imgUrl} />
        <AvatarFallback className='bg-transparent'>
          <Image className='size-4' />
        </AvatarFallback>
      </Avatar>
      <span>{classification.title}</span>
    </div>
  )
}

const SelectClassification = forwardRef<HTMLSelectElement, Props>((props) => {
  const {
    placeholder = props.multiple ? 'Select classifications' : 'Select a classification',
    className,
    onChange,
    value,
    multiple = false,
    productId,
    initialClassification
  } = props

  const { data: product, isFetching: isGettingProduct } = useQuery({
    queryKey: [getProductApi.queryKey, productId],
    queryFn: getProductApi.fn,
    enabled: !!productId
  })

  const classificationList = product?.data.productClassifications

  const classificationOptions = useMemo(() => {
    if (!classificationList) return []
    return classificationList.map((classification) => ({
      value: classification.id,
      label: classification.title,
      display: getItemDisplay(classification as TClassificationItem)
    }))
  }, [classificationList])

  const selectedOptions = useMemo(() => {
    if (!value) return undefined

    if (!multiple) {
      const option = value as TClassificationItem
      if (option.id && option.originalClassification && option.title) return undefined

      const selectedClassification = classificationList?.find((item) => {
        if (option.title) {
          return item.title === option.title
        }
        return item.id === (option.originalClassification || option.id)
      }) as TClassificationItem

      return classificationOptions.find((o) => o.value === selectedClassification?.id)
    }
    return []
  }, [value, multiple, classificationOptions, classificationList])

  const currentClassification = useMemo(() => {
    const option = value as TClassificationItem

    const selectedClassification = classificationList?.find((item) => {
      if (option?.title) {
        return item.title === option?.title
      }
      return item.id === (option?.originalClassification || option?.id)
    }) as TClassificationItem
    return selectedClassification
  }, [classificationList, value])

  const maxQuantity = useMemo(() => {
    if (initialClassification?.id && currentClassification) {
      if (initialClassification.title === currentClassification.title) {
        return currentClassification.quantity + (initialClassification?.quantity ?? 0)
      }
      return currentClassification.quantity
    }
    return currentClassification?.quantity ?? 0
  }, [initialClassification, currentClassification])

  useEffect(() => {
    if (currentClassification && onChange) {
      onChange({
        ...value,

        quantity: maxQuantity
      } as unknown as ChangeEvent<HTMLInputElement>)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxQuantity])

  return (
    <AsyncSelect
      defaultOptions={classificationOptions}
      isMulti={multiple}
      placeholder={placeholder}
      className={className}
      isLoading={isGettingProduct}
      isClearable
      value={selectedOptions}
      onChange={(options) => {
        const optionValues = options as TOption
        if (onChange) {
          const classification = classificationList?.find(
            (item) => item.id === optionValues?.value
          ) as TClassificationItem
          const formValue: TClassificationItem = {
            ...(value as TClassificationItem),
            title: classification.title,
            price: classification.price,
            type: classification.type,
            images: classification.images.map((image) => ({
              ...image,
              name: image.name ?? image.fileUrl,
              fileUrl: image.fileUrl
            })),
            quantity: maxQuantity,
            sku: (classification.sku ?? '') + +new Date().getTime(),
            originalClassification: classification.id as string
          }

          onChange(formValue as unknown as ChangeEvent<HTMLInputElement>)
        }
      }}
    />
  )
})

SelectClassification.displayName = 'SelectClassification'

export default SelectClassification
