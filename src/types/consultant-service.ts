import { StatusEnum } from './enum'
import { TFile, TServerFile } from './file'
import { TMetaData } from './request'
import { ISystemService } from './system-service'
import { TUser } from './user'

type BaseConsultantServiceField = {
  id?: string
  question: string
  orderIndex?: number
  mandatory: boolean
  images: TFile[]
  status: ServiceBookingFormQuestionStatusEnum
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
  description: string
  price: number
  images: TFile[]
  systemService: ISystemService
  serviceBookingForm: {
    id?: string
    title: string
    questions: IConsultantServiceDetail[]
    status: ServiceBookingFormStatusEnum
  }
  serviceBookingFormData: {
    id?: string
    title: string
    questions: IConsultantServiceDetail[]
    status: ServiceBookingFormStatusEnum
  }
  status: ConsultantServiceStatusEnum
  account: TUser
}

export enum QuestionTypeEnum {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TEXT = 'TEXT'
}
export interface IQuestion {
  type: ConsultantServiceTypeEnum.Text
  question: IConsultantServiceDetail
  orderIndex: number
  mandatory: boolean
  answers: Option
  images: TServerFile
}
export interface IConsultantServiceDetailServer extends TMetaData {
  account: TUser
  price: number
  images: TFile[]
  systemService: ISystemService & TMetaData
  serviceBookingForm: {
    id?: string
    title: string
    questions: IQuestion[]
    status: StatusEnum
  }
  serviceBookingFormData: {
    id?: string
    title: string
    questions: IQuestion[]
  }
  status: ConsultantServiceStatusEnum
}

export enum ConsultantServiceStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED'
}

export enum ServiceBookingFormStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum ServiceBookingFormQuestionStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}
