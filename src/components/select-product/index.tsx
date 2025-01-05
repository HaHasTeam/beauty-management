import { useQuery } from '@tanstack/react-query'
import { Image } from 'lucide-react'
import { ChangeEvent, forwardRef, HTMLAttributes, useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getProductByBrandIdApi } from '@/network/apis/product'
import { useStore } from '@/stores/store'
import { TProduct } from '@/types/product'

import { InputProps } from '../ui/input'
import { TOption } from '../ui/react-select'
import AsyncSelect from '../ui/react-select/AsyncSelect'

type Props = HTMLAttributes<HTMLSelectElement> &
  InputProps & {
    multiple?: boolean
  }

const getProductItemDisplay = (product: TProduct) => {
  const imgUrl = product.images[0]?.fileUrl
  return (
    <div className='flex items-center gap-1'>
      <Avatar className='bg-transparent size-5'>
        <AvatarImage src={imgUrl} />
        <AvatarFallback className='bg-transparent'>
          <Image className='size-4' />
        </AvatarFallback>
      </Avatar>
      <span>{product.name}</span>
    </div>
  )
}

const SelectProduct = forwardRef<HTMLSelectElement, Props>((props) => {
  const { placeholder = props.multiple ? 'Select products' : 'Select a product', className, onChange, value } = props
  const { userData } = useStore(
    useShallow((state) => ({
      userData: state.user
    }))
  )

  const brandId = useMemo(() => (userData?.brands?.length ? userData.brands[0].id : ''), [userData])

  const { data: productList, isFetching: isGettingProductList } = useQuery({
    queryKey: [
      getProductByBrandIdApi.queryKey,
      {
        brandId
      }
    ],
    queryFn: getProductByBrandIdApi.fn,
    enabled: !!brandId
  })

  const productOptions = useMemo(() => {
    if (!productList) return []
    return productList?.data.map((product) => ({
      value: product.id,
      label: product.name,
      display: getProductItemDisplay(product)
    }))
  }, [productList])

  const selectedOptions = useMemo(() => {
    if (!value) return []
    const options = value as string[]
    return options.map((option) => {
      const product = productList?.data.find((product) => product.id === option)
      return {
        value: product?.id,
        label: product?.name,
        display: getProductItemDisplay(product as TProduct)
      }
    })
  }, [value, productList?.data])

  return (
    <AsyncSelect
      defaultOptions={productOptions}
      isMulti={true}
      placeholder={placeholder}
      className={className}
      isLoading={isGettingProductList}
      isClearable
      value={selectedOptions}
      onChange={(options) => {
        const optionValues = options as TOption[]

        if (onChange) onChange(optionValues.map((option) => option.value) as unknown as ChangeEvent<HTMLInputElement>)
      }}
    />
  )
})

SelectProduct.displayName = 'SelectProduct'

export default SelectProduct
