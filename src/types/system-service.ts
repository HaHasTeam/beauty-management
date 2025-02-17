import { TMetaData } from './request'

export type ISystemService = {
  name: string
}

export type IResponseSystemService = TMetaData & ISystemService
