import { IReport, ReportStatusEnum, ReportTypeEnum } from '@/types/report'

export type TGetFilteredReportRequestParams = {
  type?: ReportTypeEnum
  status?: ReportTypeEnum
  assigneeId?: string
}

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
