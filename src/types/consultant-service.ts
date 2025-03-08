import { TFile } from './file'
import { TMetaData } from './request'
import { ISystemService } from './system-service'

type BaseConsultantServiceField = {
  id?: string
  question: string
  orderIndex?: number
  mandatory: boolean
  images: TFile[]
}

type Option = Record<string, string>

export enum ConsultantServiceTypeEnum {
  Text = 'TEXT',
  SingleChoice = 'SINGLE_CHOICE',
  MultipleChoice = 'MULTIPLE_CHOICE'
}

export const ConsultantServiceTypeOptions = Object.keys(ConsultantServiceTypeEnum).map((key) => ({
  label: key.toUpperCase(),
  value: ConsultantServiceTypeEnum[key as keyof typeof ConsultantServiceTypeEnum]
}))

export type ConsultantServiceType = BaseConsultantServiceField &
  (
    | {
        type: ConsultantServiceTypeEnum.Text
        answers?: object
      }
    | {
        type: ConsultantServiceTypeEnum.SingleChoice | ConsultantServiceTypeEnum.MultipleChoice
        answers: Option
      }
  )

export type IConsultantServiceDetail = ConsultantServiceType

export interface IConsultantService extends TMetaData {
  price: number
  images: TFile[]
  systemService: ISystemService & TMetaData
  serviceBookingForm: {
    id?: string
    title: string
    questions: IConsultantServiceDetail[]
  }
  serviceBookingFormData: {
    id?: string
    title: string
    questions: IConsultantServiceDetail[]
  }
  status: ConsultantServiceStatusEnum
}

export enum ConsultantServiceStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED'
}
