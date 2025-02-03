import { TClassification } from '@/types/classification'
import { TPreOrder } from '@/types/pre-order'

export type TAddPreOderRequestParams = Pick<TPreOrder, 'startTime' | 'endTime'> & {
  product: string
  productClassifications: Partial<Pick<TClassification, 'images' | 'price' | 'quantity' | 'title' | 'sku' | 'type'>>[]
}

export type TUpdatePreOrderRequestParams = Partial<
  TAddPreOderRequestParams & {
    id?: string
    status: TPreOrder['status']
  }
>
