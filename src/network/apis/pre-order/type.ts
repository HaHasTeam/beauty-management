import { TClassification } from '@/types/classification'
import { TPreOrder } from '@/types/pre-order'

export type TAddPreOderRequestParams = Pick<TPreOrder, 'startTime' | 'endTime'> & {
  product: string
  productClassifications: Partial<
    Pick<TClassification, 'images' | 'price' | 'quantity' | 'title' | 'sku' | 'type' | 'color' | 'size' | 'other'>
  >[]
}

export type TUpdatePreOrderRequestParams = Partial<
  TAddPreOderRequestParams & {
    id?: string
    status: TPreOrder['status']
  }
>

export interface GetPreOrderFilterRequestParams {
  page?: number
  limit?: number
  sortBy?: string
  order?: 'ASC' | 'DESC'
  productIds?: string
  brandId?: string
  statuses?: string
  startTime?: string
  endTime?: string
}
