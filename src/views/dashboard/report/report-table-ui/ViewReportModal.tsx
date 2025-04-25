import { type Row } from '@tanstack/react-table'
import { format } from 'date-fns'
import {
  AlertTriangle,
  Ban,
  Calendar,
  CalendarDays,
  CheckCircle,
  ClipboardList,
  Clock,
  Download,
  Eye,
  FilesIcon,
  FileSpreadsheet,
  FileText,
  Hash,
  Hourglass,
  Info,
  Package,
  PencilLine,
  Receipt,
  ShieldAlert,
  UserCircle,
  XCircle
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@/components/button'
import { PreviewDialog } from '@/components/file-input/PreviewImageDialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { IReport, ReportStatusEnum, ReportTypeEnum } from '@/types/report'
import { formatCurrency } from '@/utils/number'

interface ViewReportModalProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  report?: Row<IReport>['original']
}

export function ViewReportModal({ report, ...props }: ViewReportModalProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('details')
  const isDesktop = useMediaQuery('(min-width: 640px)')

  if (!report) {
    return null
  }

  const getStatusBadge = (status: ReportStatusEnum) => {
    const baseClasses =
      'flex items-center gap-1.5 px-3 py-1.5 shadow-sm rounded-full text-xs font-medium transition-all'
    let hoverClasses = 'hover:shadow-md'
    let icon: React.ReactNode = <Info className='h-3.5 w-3.5' />
    let text: string = 'Unknown Status'
    let gradient = 'bg-gradient-to-br from-slate-100 to-slate-200'
    let textColor = 'text-slate-700'
    let borderColor = 'border-slate-300'
    let glow = 'shadow-slate-500/10'

    const validStatuses = Object.values(ReportStatusEnum) as string[]
    if (!validStatuses.includes(status)) {
      text = status
    } else {
      switch (status as ReportStatusEnum) {
        case ReportStatusEnum.PENDING:
          gradient = 'bg-gradient-to-br from-amber-100 to-amber-200'
          textColor = 'text-amber-800'
          borderColor = 'border-amber-300/50'
          hoverClasses = 'hover:from-amber-200 hover:to-amber-300 hover:shadow-lg'
          glow = 'shadow-amber-500/20'
          icon = <Hourglass className='h-3.5 w-3.5' />
          text = t('report.status.pending', 'Pending')
          break
        case ReportStatusEnum.IN_PROCESSING:
          gradient = 'bg-gradient-to-br from-blue-100 to-blue-200'
          textColor = 'text-blue-800'
          borderColor = 'border-blue-300/50'
          hoverClasses = 'hover:from-blue-200 hover:to-blue-300 hover:shadow-lg'
          glow = 'shadow-blue-500/20'
          icon = <Clock className='h-3.5 w-3.5' />
          text = t('report.status.inProcessing', 'In Processing')
          break
        case ReportStatusEnum.REJECTED:
          gradient = 'bg-gradient-to-br from-red-100 to-red-200'
          textColor = 'text-red-800'
          borderColor = 'border-red-300/50'
          hoverClasses = 'hover:from-red-200 hover:to-red-300 hover:shadow-lg'
          glow = 'shadow-red-500/20'
          icon = <XCircle className='h-3.5 w-3.5' />
          text = t('report.status.rejected', 'Rejected')
          break
        case ReportStatusEnum.APPROVED:
          gradient = 'bg-gradient-to-br from-green-100 to-green-200'
          textColor = 'text-green-800'
          borderColor = 'border-green-300/50'
          hoverClasses = 'hover:from-green-200 hover:to-green-300 hover:shadow-lg'
          glow = 'shadow-green-500/20'
          icon = <CheckCircle className='h-3.5 w-3.5' />
          text = t('report.status.approved', 'Approved')
          break
        case ReportStatusEnum.CANCELLED:
          gradient = 'bg-gradient-to-br from-slate-100 to-slate-200'
          textColor = 'text-slate-700'
          borderColor = 'border-slate-300/50'
          hoverClasses = 'hover:from-slate-200 hover:to-slate-300 hover:shadow-lg'
          glow = 'shadow-slate-500/10'
          icon = <Ban className='h-3.5 w-3.5' />
          text = t('report.status.cancelled', 'Cancelled')
          break
      }
    }

    return (
      <Badge
        className={cn(
          baseClasses,
          gradient,
          textColor,
          borderColor,
          hoverClasses,
          `shadow-inner shadow-white/10 hover:${glow}`
        )}
      >
        {icon}
        <span>{text}</span>
      </Badge>
    )
  }

  const getTypeIcon = (type: ReportTypeEnum) => {
    switch (type) {
      case ReportTypeEnum.ORDER:
        return <Package className='h-5 w-5 text-blue-500' />
      case ReportTypeEnum.BOOKING:
        return <CalendarDays className='h-5 w-5 text-purple-500' />
      case ReportTypeEnum.TRANSACTION:
        return <Receipt className='h-5 w-5 text-amber-500' />
      case ReportTypeEnum.SYSTEM_FEATURE:
        return <FileSpreadsheet className='h-5 w-5 text-emerald-500' />
      case ReportTypeEnum.OTHER:
        return <FileText className='h-5 w-5 text-slate-500' />
      default:
        return <AlertTriangle className='h-5 w-5 text-red-500' />
    }
  }

  const getTypeLabel = (type: ReportTypeEnum) => {
    switch (type) {
      case ReportTypeEnum.ORDER:
        return t('report.types.ORDER', 'Order Issue')
      case ReportTypeEnum.BOOKING:
        return t('report.types.BOOKING', 'Booking Issue')
      case ReportTypeEnum.TRANSACTION:
        return t('report.types.TRANSACTION', 'Transaction Issue')
      case ReportTypeEnum.SYSTEM_FEATURE:
        return t('report.types.SYSTEM_FEATURE', 'System Feature Issue')
      case ReportTypeEnum.OTHER:
        return t('report.types.OTHER', 'Other Issue')
      default:
        return t('report.types.UNKNOWN', 'Unknown Issue')
    }
  }

  const getTypeColor = (type: ReportTypeEnum) => {
    switch (type) {
      case ReportTypeEnum.ORDER:
        return 'blue'
      case ReportTypeEnum.BOOKING:
        return 'purple'
      case ReportTypeEnum.TRANSACTION:
        return 'amber'
      case ReportTypeEnum.SYSTEM_FEATURE:
        return 'emerald'
      case ReportTypeEnum.OTHER:
        return 'slate'
      default:
        return 'red'
    }
  }

  const color = getTypeColor(report.type)

  const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; colorClass?: string }> = ({
    icon,
    title,
    colorClass = 'text-slate-600'
  }) => (
    <h3 className={cn('text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2', colorClass)}>
      {icon}
      <span>{title}</span>
    </h3>
  )

  const modalContent = (
    <>
      <ScrollArea className='max-h-[calc(80vh-110px)] pr-4 -mr-2'>
        <Tabs defaultValue='details' value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid grid-cols-2 mb-4'>
            <TabsTrigger value='details'>
              <ClipboardList className='mr-2 h-4 w-4' />
              {t('report.tabs.details', 'Details')}
            </TabsTrigger>
            <TabsTrigger value='evidence'>
              <ShieldAlert className='mr-2 h-4 w-4' />
              {t('report.tabs.evidence', 'Evidence')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value='details' className='space-y-5 mt-2 focus-visible:outline-none focus-visible:ring-0'>
            <div className='space-y-6'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <div>
                  <SectionHeader
                    icon={<UserCircle className='h-4 w-4' />}
                    title={t('report.reportedBy', 'Reported By')}
                    colorClass='text-blue-700'
                  />
                  <div className='flex items-center gap-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100/70 shadow-inner'>
                    <Avatar className='h-9 w-9 border-2 border-white shadow'>
                      <AvatarImage src={report.reporter?.avatar || ''} />
                      <AvatarFallback className='bg-blue-100 text-blue-700 font-semibold'>
                        {report.reporter?.firstName?.charAt(0) || report.reporter?.lastName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1 min-w-0'>
                      <div className='text-sm font-medium truncate'>
                        {report.reporter?.firstName || ''}{' '}
                        {report.reporter?.lastName || t('report.anonymous', 'Anonymous')}
                      </div>
                      <div className='text-xs text-muted-foreground truncate'>
                        {report.reporter?.email || t('report.unknown', 'Unknown')}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <SectionHeader
                    icon={<Calendar className='h-4 w-4' />}
                    title={t('report.timestamps', 'Timestamps')}
                    colorClass='text-slate-700'
                  />
                  <div className='space-y-2.5 text-sm p-3 bg-slate-50/50 rounded-lg border border-slate-100/70 shadow-inner'>
                    <div className='flex justify-between items-center'>
                      <span className='text-muted-foreground flex items-center gap-1.5'>
                        <Clock className='h-3.5 w-3.5' />
                        {t('report.dateCreated', 'Created')}:
                      </span>
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className='font-medium'>{format(new Date(report.createdAt), 'Pp')}</span>
                          </TooltipTrigger>
                          <TooltipContent>{new Date(report.createdAt).toLocaleString()}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-muted-foreground flex items-center gap-1.5'>
                        <PencilLine className='h-3.5 w-3.5' />
                        {t('report.lastUpdated', 'Updated')}:
                      </span>
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className='font-medium'>{format(new Date(report.updatedAt), 'Pp')}</span>
                          </TooltipTrigger>
                          <TooltipContent>{new Date(report.updatedAt).toLocaleString()}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <SectionHeader
                  icon={<Hash className='h-4 w-4' />}
                  title={t('report.reportId', 'Report ID')}
                  colorClass='text-slate-700'
                />
                <p className='text-sm font-mono text-slate-700 break-all bg-slate-100/50 px-3 py-2 rounded-md shadow-inner border border-slate-200/60'>
                  {report.id}
                </p>
              </div>

              {report.type === ReportTypeEnum.ORDER && report.order && (
                <div>
                  <SectionHeader
                    icon={<Package className='h-4 w-4' />}
                    title={t('report.relatedOrder', 'Related Order')}
                    colorClass={`text-${color}-700`}
                  />
                  <div className='space-y-1.5'>
                    <div
                      className={`flex items-center space-x-3 p-3 bg-${color}-50/80 rounded-lg shadow-inner border border-${color}-100/60`}
                    >
                      <div
                        className={`h-12 w-12 rounded-lg bg-white border border-${color}-200 flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0`}
                      >
                        <Package className={`h-6 w-6 text-${color}-500`} />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='text-sm font-medium truncate'>
                          {t('report.orderPrefix', 'Order')}{' '}
                          <span className='font-semibold text-slate-800'>#{report.order.id}</span>
                        </div>
                        <div className='flex justify-between text-xs text-slate-600 mt-1'>
                          <span className='truncate max-w-[200px] flex items-center gap-1'>
                            <UserCircle className='h-3 w-3 text-slate-400' />
                            {report.order.recipientName || t('report.recipient', 'Recipient')}
                          </span>
                          <span className={`font-semibold text-${color}-800`}>
                            {formatCurrency(report.order.totalPrice || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {report.type === ReportTypeEnum.BOOKING && report.booking && (
                <div>
                  <SectionHeader
                    icon={<CalendarDays className='h-4 w-4' />}
                    title={t('report.relatedBooking', 'Related Booking')}
                    colorClass={`text-${color}-700`}
                  />
                  <div className='space-y-1.5'>
                    <div
                      className={`flex items-center space-x-3 p-3 bg-${color}-50/80 rounded-lg shadow-inner border border-${color}-100/60`}
                    >
                      <div
                        className={`h-12 w-12 rounded-lg bg-white border border-${color}-200 flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0`}
                      >
                        <CalendarDays className={`h-6 w-6 text-${color}-500`} />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='text-sm font-medium truncate'>
                          {t('report.bookingPrefix', 'Booking')}{' '}
                          <span className='font-semibold text-slate-800'>#{report.booking.id}</span>
                        </div>
                        <div className='flex justify-between text-xs text-slate-600 mt-1'>
                          <span className='truncate max-w-[200px] flex items-center gap-1'>
                            <Calendar className='h-3 w-3 text-slate-400' />
                            {report.booking.startTime
                              ? new Date(report.booking.startTime).toLocaleString([], {
                                  dateStyle: 'short',
                                  timeStyle: 'short'
                                })
                              : t('report.noTime', 'No time')}
                          </span>
                          <span className={`font-semibold text-${color}-800`}>
                            {formatCurrency(report.booking.totalPrice || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <SectionHeader
                  icon={<AlertTriangle className='h-4 w-4' />}
                  title={t('report.reason', 'Reason for Report')}
                  colorClass='text-red-700'
                />
                <div className='bg-red-50/40 rounded-lg p-3.5 shadow-inner border border-red-100/50'>
                  <p className='whitespace-pre-wrap text-sm leading-relaxed text-slate-800'>{report.reason}</p>
                </div>
                <p className='text-xs text-red-600/80 italic mt-2.5 px-1 flex items-center gap-1.5'>
                  <Info className='h-3 w-3 flex-shrink-0' />
                  <span>
                    {t('report.reasonHint', 'This is the description provided by the user who submitted the report.')}
                  </span>
                </p>
              </div>

              <div>
                <SectionHeader
                  icon={<UserCircle className='h-4 w-4' />}
                  title={t('report.assignment', 'Assignment Status')}
                  colorClass='text-slate-700'
                />
                {report.assignee ? (
                  <div className='flex items-start gap-3 py-3 px-3 bg-slate-100/60 rounded-lg shadow-inner border border-slate-200/80'>
                    <Avatar className='h-9 w-9 shadow-sm border border-white'>
                      <AvatarImage src={report.assignee.avatar || ''} />
                      <AvatarFallback className='text-sm bg-blue-100 text-blue-700 font-semibold'>
                        {report.assignee.firstName?.charAt(0) || report.assignee.lastName?.charAt(0) || 'S'}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1 min-w-0'>
                      <div className='text-sm font-medium text-slate-800 truncate'>
                        {report.assignee.firstName || ''} {report.assignee.lastName || t('report.staff', 'Staff')}
                      </div>
                      <div className='text-xs text-muted-foreground truncate mt-0.5'>
                        {report.assignee.email || t('report.unknownEmail', 'No email provided')}
                      </div>
                      <div className='text-xs text-muted-foreground capitalize mt-0.5'>
                        {report.assignee.role
                          ? report.assignee.role.toLowerCase().replace('_', ' ')
                          : t('report.unknownRole', 'Unknown Role')}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='bg-slate-100/60 rounded-lg p-3 shadow-inner border border-slate-200/80'>
                    <p className='text-sm italic text-muted-foreground flex items-center gap-2'>
                      <Info className='h-4 w-4 text-slate-400 flex-shrink-0' />
                      <span>{t('report.unassigned', 'This report is not yet assigned to a staff member.')}</span>
                    </p>
                    <p className='text-xs text-slate-500 mt-1.5 pl-6'>
                      {t('report.unassignedHint', 'An admin can assign this report for investigation.')}
                    </p>
                  </div>
                )}
              </div>

              {report.resultNote && (
                <div>
                  <SectionHeader
                    icon={<CheckCircle className='h-4 w-4' />}
                    title={t('report.resultNote', 'Resolution Note')}
                    colorClass='text-green-700'
                  />
                  <div className='bg-green-50/40 rounded-lg p-3.5 shadow-inner border border-green-100/50'>
                    <p className='whitespace-pre-wrap text-sm leading-relaxed text-slate-800'>{report.resultNote}</p>
                  </div>
                  <p className='text-xs text-green-600/80 italic mt-2.5 px-1 flex items-center gap-1.5'>
                    <Info className='h-3 w-3 flex-shrink-0' />
                    <span>
                      {t('report.resolutionHint', 'This note details the outcome and actions taken for this report.')}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value='evidence' className='mt-2 focus-visible:outline-none focus-visible:ring-0'>
            <div className='border rounded-xl p-4 shadow-sm bg-gradient-to-br from-white via-white to-slate-50/30 border-slate-200/70'>
              <SectionHeader
                icon={<FilesIcon className='h-4 w-4' />}
                title={t('report.evidence', 'Evidence Files')}
                colorClass='text-slate-700'
              />

              {report.files && report.files.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4'>
                  {report.files.map((file, index) => {
                    const isImage = file.fileUrl?.match(/\.(jpeg|jpg|gif|png|webp)$/i)
                    const isVideo = file.fileUrl?.toLowerCase().endsWith('.mp4')

                    return (
                      <div
                        key={file.id || index}
                        className='border rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-xl hover:border-blue-300/80 bg-white shadow-sm hover:-translate-y-1'
                      >
                        <div className='relative aspect-video bg-slate-100 flex items-center justify-center overflow-hidden'>
                          {(isImage || isVideo) && file.fileUrl ? (
                            <PreviewDialog
                              trigger={
                                <button
                                  className='w-full h-full block relative cursor-pointer group/trigger'
                                  aria-label={t('report.previewFile', 'Preview file')}
                                >
                                  {isImage ? (
                                    <img
                                      src={file.fileUrl}
                                      alt={file.name || `${t('report.evidence', 'Evidence')} ${index + 1}`}
                                      className='w-full h-full object-cover transition-all duration-300 group-hover/trigger:scale-105 group-hover/trigger:brightness-90'
                                      loading='lazy'
                                    />
                                  ) : (
                                    <video
                                      className='w-full h-full object-cover transition-all duration-300 group-hover/trigger:scale-105 group-hover/trigger:brightness-90'
                                      src={`${file.fileUrl}#t=0.1`}
                                      preload='metadata'
                                    />
                                  )}
                                  <div className='absolute inset-0 bg-black/0 group-hover/trigger:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover/trigger:opacity-100'>
                                    <Eye className='h-9 w-9 text-white drop-shadow-lg transform scale-75 group-hover/trigger:scale-100 transition-transform duration-300 ease-out' />
                                  </div>
                                </button>
                              }
                              content={file.fileUrl}
                              contentType={isImage ? 'image' : 'video'}
                              className='max-w-4xl'
                            />
                          ) : (
                            <div className='w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-slate-100 to-slate-200 p-4'>
                              <FilesIcon className='w-12 h-12 text-slate-400 group-hover:text-slate-500 transition-colors duration-300' />
                              <p className='text-sm text-center text-slate-600 px-2 truncate max-w-full group-hover:text-slate-700 transition-colors duration-300'>
                                {file.name || `${t('report.filePrefix', 'File')} ${index + 1}`}
                              </p>
                              <Badge
                                variant='outline'
                                className='mt-1 text-xs bg-white shadow-sm border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors duration-300'
                              >
                                {file.fileUrl?.split('.').pop()?.toUpperCase() || t('report.fileType.unknown', 'FILE')}
                              </Badge>
                            </div>
                          )}
                          <div className='absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full shadow'>
                            {isImage
                              ? t('report.fileType.image', 'Image')
                              : isVideo
                                ? t('report.fileType.video', 'Video')
                                : file.fileUrl?.split('.').pop()?.toUpperCase() || t('report.fileType.unknown', 'File')}
                          </div>
                        </div>

                        <div className='p-3 text-xs border-t bg-slate-50/50 flex items-center justify-between gap-2'>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className='truncate block flex-1 text-slate-700 font-medium cursor-default'>
                                  {file.name || `${t('report.evidenceFile', 'Evidence file')} ${index + 1}`}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side='top' align='start'>
                                <p className='max-w-xs'>
                                  {file.name || `${t('report.evidenceFile', 'Evidence file')} ${index + 1}`}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a
                                  href={file.fileUrl}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='text-blue-600 hover:text-blue-700 hover:bg-blue-100 p-1.5 rounded-md transition-colors flex-shrink-0'
                                  download
                                  aria-label={t('report.download', 'Download')}
                                >
                                  <Download className='h-4 w-4' />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent side='top'>{t('report.download', 'Download')}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className='text-center py-16 bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl shadow-inner border border-slate-200/60'>
                  <FilesIcon className='h-16 w-16 text-slate-300 mx-auto mb-4 opacity-70' />
                  <p className='text-slate-600 font-medium max-w-md mx-auto'>
                    {t('report.noEvidence', 'No evidence files attached.')}
                  </p>
                  <p className='text-slate-500 text-sm mt-2 max-w-xs mx-auto'>
                    {t('report.noEvidenceHint', 'Users can attach files to support their reports.')}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>

      <Separator className='my-4 bg-slate-200/80' />
      <div className='flex flex-wrap justify-end gap-2 px-1'>
        <Button
          type='button'
          variant='ghost'
          className='text-slate-700 hover:bg-slate-100'
          onClick={() => props.onOpenChange?.(false)}
        >
          {t('common.close', 'Close')}
        </Button>
      </div>
    </>
  )

  const headerContent = (
    <div
      className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-${color}-100 to-${color}-200 flex items-center justify-center shadow-md border border-${color}-200/50`}
    >
      {getTypeIcon(report.type)}
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog {...props}>
        <DialogContent className='md:max-w-2xl sm:max-w-xl p-6 !rounded-xl'>
          <DialogHeader className='mb-5 flex flex-row items-start gap-4 border-b pb-4 border-slate-200/90'>
            {headerContent}
            <div className='flex-1 min-w-0'>
              <div className='flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-1'>
                <DialogTitle className='text-xl font-semibold text-gray-800'>{getTypeLabel(report.type)}</DialogTitle>
                {getStatusBadge(report.status)}
              </div>
              <p className='text-sm text-muted-foreground leading-snug'>
                {t(
                  'report.viewDescription',
                  'Detailed view of the report including user description and supporting evidence.'
                )}
              </p>
            </div>
          </DialogHeader>

          {modalContent}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer {...props}>
      <DrawerContent className='pb-safe'>
        <DrawerHeader className='mb-4 flex flex-row items-start gap-3 border-b pb-4 border-slate-200/90'>
          {headerContent}
          <div className='flex-1 min-w-0'>
            <div className='flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-1'>
              <DrawerTitle className='text-lg font-semibold text-gray-800'>{getTypeLabel(report.type)}</DrawerTitle>
              {getStatusBadge(report.status)}
            </div>
          </div>
        </DrawerHeader>

        <div className='px-4 pb-4'>{modalContent}</div>
      </DrawerContent>
    </Drawer>
  )
}
