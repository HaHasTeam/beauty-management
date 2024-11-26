import { IOption } from './option'

export type IFormValues = {
  [key: string]: IOption[] | string
}
