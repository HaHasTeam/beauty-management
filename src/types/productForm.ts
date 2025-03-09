import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { FormProductSchema } from '@/variables/productFormDetailFields'

import { IOption } from './option'

export type IFormValues = {
  [key: string]: IOption[] | string
}

// sale information component
export type IClassificationOption = { title: string; options: string[] }
export type ICombination = {
  id?: string
  title?: string
  price?: number
  quantity?: number
  images?: File[]
  type?: string
  sku?: string
  color?: string
  size?: string
  other?: string
}

export interface SalesInformationProps {
  form: UseFormReturn<z.infer<typeof FormProductSchema>>
  resetSignal?: boolean
  defineFormSignal?: boolean
  mode?: 'create' | 'update'
  setIsValid: React.Dispatch<boolean>
  setActiveStep: React.Dispatch<number>
  activeStep: number
  setCompleteSteps: React.Dispatch<React.SetStateAction<number[]>>
}
