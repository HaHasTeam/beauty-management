import { BaseParams } from '@/types/request'

export type TFilterLivestreamsParams = BaseParams<{
  title?: string
  statuses: string[]
}>
