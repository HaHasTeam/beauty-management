import { type Row } from '@tanstack/react-table'
import { AlertTriangle, FilesIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@/components/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IReport, ReportStatusEnum, ReportTypeEnum } from '@/types/report'

interface ViewReportModalProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  report?: Row<IReport>['original']
}

export function ViewReportModal({ report, ...props }: ViewReportModalProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('details')

  if (!report) {
    return null
  }

  const getStatusBadge = (status: ReportStatusEnum) => {
    switch (status) {
      case ReportStatusEnum.PENDING:
        return <Badge className='bg-yellow-500 hover:bg-yellow-600'>{t('report.status.pending') || 'Pending'}</Badge>
      case ReportStatusEnum.IN_PROCESSING:
        return (
          <Badge className='bg-blue-500 hover:bg-blue-600'>{t('report.status.inProcessing') || 'In Processing'}</Badge>
        )
      case ReportStatusEnum.REJECTED:
        return <Badge className='bg-red-500 hover:bg-red-600'>{t('report.status.rejected') || 'Rejected'}</Badge>
      case ReportStatusEnum.APPROVED:
        return <Badge className='bg-green-500 hover:bg-green-600'>{t('report.status.approved') || 'Approved'}</Badge>
      case ReportStatusEnum.CANCELLED:
        return <Badge className='bg-gray-500 hover:bg-gray-600'>{t('report.status.cancelled') || 'Cancelled'}</Badge>
      default:
        return <Badge className='bg-gray-500 hover:bg-gray-600'>{status}</Badge>
    }
  }

  const getTypeLabel = (type: ReportTypeEnum) => {
    switch (type) {
      case ReportTypeEnum.ORDER:
        return t('report.types.ORDER') || 'Order Issue'
      case ReportTypeEnum.BOOKING:
        return t('report.types.BOOKING') || 'Booking Issue'
      case ReportTypeEnum.TRANSACTION:
        return t('report.types.TRANSACTION') || 'Transaction Issue'
      case ReportTypeEnum.SYSTEM_FEATURE:
        return t('report.types.SYSTEM_FEATURE') || 'System Feature Issue'
      case ReportTypeEnum.OTHER:
        return t('report.types.OTHER') || 'Other Issue'
      default:
        return type
    }
  }

  return (
    <Dialog {...props}>
      <DialogContent className='md:max-w-2xl sm:max-w-lg'>
        <ScrollArea className='max-h-[80vh]'>
          <div className='space-y-3 mr-2'>
            <DialogHeader>
              <div className='flex items-start gap-3'>
                <div className='bg-red-100 p-2 rounded-full'>
                  <AlertTriangle className='h-6 w-6 text-red-500' />
                </div>
                <div>
                  <DialogTitle className='text-xl font-bold text-primary flex items-center gap-2'>
                    {getTypeLabel(report.type)} {getStatusBadge(report.status)}
                  </DialogTitle>
                  <DialogDescription className='text-justify mt-1'>
                    {t('report.viewDescription') || 'Details about the reported issue.'}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <Tabs defaultValue='details' value={activeTab} onValueChange={setActiveTab}>
              <TabsList className='grid grid-cols-2'>
                <TabsTrigger value='details'>{t('report.tabs.details') || 'Details'}</TabsTrigger>
                <TabsTrigger value='evidence'>{t('report.tabs.evidence') || 'Evidence'}</TabsTrigger>
              </TabsList>

              <TabsContent value='details' className='space-y-4 mt-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <h3 className='font-medium text-sm text-gray-500'>{t('report.reportId') || 'Report ID'}</h3>
                    <p>{report.id}</p>
                  </div>

                  <div className='space-y-2'>
                    <h3 className='font-medium text-sm text-gray-500'>{t('report.reportedBy') || 'Reported By'}</h3>
                    <div className='flex items-center gap-2'>
                      <span>
                        {report.reporter?.firstName || ''} {report.reporter?.lastName || ''}
                      </span>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <h3 className='font-medium text-sm text-gray-500'>{t('report.dateCreated') || 'Date Created'}</h3>
                    <p>{new Date(report.createdAt).toLocaleString()}</p>
                  </div>

                  <div className='space-y-2'>
                    <h3 className='font-medium text-sm text-gray-500'>{t('report.assignedTo') || 'Assigned To'}</h3>
                    <p>
                      {report.assignee
                        ? `${report.assignee.firstName || ''} ${report.assignee.lastName || ''}`
                        : t('report.unassigned') || 'Unassigned'}
                    </p>
                  </div>

                  {report.type === ReportTypeEnum.ORDER && report.order && (
                    <div className='space-y-2 col-span-2'>
                      <h3 className='font-medium text-sm text-gray-500'>
                        {t('report.relatedOrder') || 'Related Order'}
                      </h3>
                      <p>Order #{report.order.id}</p>
                    </div>
                  )}

                  {report.type === ReportTypeEnum.BOOKING && report.booking && (
                    <div className='space-y-2 col-span-2'>
                      <h3 className='font-medium text-sm text-gray-500'>
                        {t('report.relatedBooking') || 'Related Booking'}
                      </h3>
                      <p>Booking #{report.booking.id}</p>
                    </div>
                  )}

                  <div className='space-y-2 col-span-2'>
                    <h3 className='font-medium text-sm text-gray-500'>{t('report.reason') || 'Reason'}</h3>
                    <p className='whitespace-pre-wrap'>{report.reason}</p>
                  </div>

                  {report.resultNote && (
                    <div className='space-y-2 col-span-2'>
                      <h3 className='font-medium text-sm text-gray-500'>{t('report.resultNote') || 'Result Note'}</h3>
                      <p className='whitespace-pre-wrap'>{report.resultNote}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value='evidence' className='space-y-4 mt-4'>
                {report.files && report.files.length > 0 ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                    {report.files.map((file, index) => (
                      <div key={file.id || index} className='border rounded-lg overflow-hidden'>
                        {file.fileUrl?.toLowerCase().endsWith('.mp4') ? (
                          <video controls className='w-full h-48 object-cover' src={file.fileUrl} />
                        ) : file.fileUrl?.match(/\.(jpeg|jpg|gif|png)$/) ? (
                          <img
                            src={file.fileUrl}
                            alt={file.name || `Evidence ${index + 1}`}
                            className='w-full h-48 object-cover'
                          />
                        ) : (
                          <div className='w-full h-48 flex items-center justify-center bg-gray-100'>
                            <FilesIcon className='w-12 h-12 text-gray-400' />
                            <p className='text-sm text-gray-500 mt-2'>{file.name || `File ${index + 1}`}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-8'>
                    <p className='text-gray-500'>
                      {t('report.noEvidence') || 'No evidence files attached to this report.'}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter className='pt-4'>
              <Button
                type='button'
                variant='outline'
                className='border-primary/70 text-gray-600 hover:bg-gray-100'
                onClick={() => props.onOpenChange?.(false)}
              >
                {t('common.close') || 'Close'}
              </Button>
            </DialogFooter>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
