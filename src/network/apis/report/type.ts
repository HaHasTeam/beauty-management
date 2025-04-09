import { IReport, ReportStatusEnum, ReportTypeEnum } from '@/types/report'
import { BaseParams } from '@/types/request'

export type TGetFilteredReportRequestParams = BaseParams<{
  types?: ReportTypeEnum[]
  statuses?: ReportStatusEnum[]
  reason?: string
  assigneeId?: string
}>

export type TCreateReportRequestParams = Pick<IReport, 'type' | 'reason'> & {
  orderId?: string
  bookingId?: string
  transactionId?: string
  files: string[]
}

export type TAssignReportRequestParams = {
  assigneeId: string
  id: string
}

export type TUpdateReportStatusRequestParams = {
  id: string
  status: ReportStatusEnum
}

export type TUpdateReportNoteRequestParams = {
  id: string
  resultNote: string
}
