import { TGroupProduct } from '@/types/group-product'
import { TVoucher } from '@/types/voucher'

type GroupProductCriteria = {
  id?: string
  threshold: number
  voucher: Pick<TVoucher, 'name' | 'description' | 'discountType' | 'discountValue' | 'code'> & {
    id?: string
  }
}

export type TCreateGroupProductRequestParams = Pick<
  TGroupProduct,
  'name' | 'description' | 'startTime' | 'endTime' | 'maxBuyAmountEachPerson'
> & {
  productIds: string[]
  criterias: GroupProductCriteria[]
  brandId: string
}

export type TUpdateGroupProductRequestParams = Pick<
  TGroupProduct,
  'id' | 'name' | 'description' | 'startTime' | 'endTime' | 'maxBuyAmountEachPerson'
> & {
  productIds: string[]
  criterias: GroupProductCriteria[]
  brandId: string
}

export type GetGroupProductFilterRequestParams = {
  page?: number
  limit?: number
  sortBy?: string
  order?: 'ASC' | 'DESC'
  statuses?: string
  startTime?: string
  endTime?: string
  productIds?: string[]
  name?: string
}
