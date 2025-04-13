import { FileEnum, StatusEnum } from './enum'
import { TMetaData } from './request'

export enum FileStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}
export type TFile = {
  name?: string | null
  fileUrl: string
  id?: string
  status?: FileStatusEnum
}

export type CustomFile = File & {
  fileUrl?: string
  id?: string
  status?: FileStatusEnum
  index?: number
}

export type TServerFile = TMetaData & {
  id: string
  fileUrl: string
  name?: string | null
  status: StatusEnum
  type: FileEnum
}
