import { TMetaData } from './request'

export type TBankAccount = TMetaData & {
  accountNumber: string
  accountName: string
  bankName: string
  isDefault: boolean
}
