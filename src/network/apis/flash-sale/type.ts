import { TFlashSale } from '@/types/flash-sale'

export type TAddFlashSaleRequestParams = Pick<
  TFlashSale,
  'startTime' | 'endTime' | 'discount' | 'productClassifications'
> & {
  product: string
}

export type TGetAllFlashSaleByBrandIdRequestParams = {
  brandId: string
}

export type TUpdateFlashSaleRequestParams = Pick<TFlashSale, 'id'> &
  Partial<Omit<TFlashSale, 'product'>> & {
    product?: string
  }
