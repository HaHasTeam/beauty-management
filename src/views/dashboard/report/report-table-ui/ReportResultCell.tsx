import { format } from 'date-fns'
import { AlertCircleIcon, ChevronDown, ChevronUp, FileTextIcon, FolderIcon } from 'lucide-react'
import { useState } from 'react'

import { ImagePreviewThumbnail } from '@/components/image-preview'
import { Button } from '@/components/ui/button'
import { IReport, ReportStatusEnum } from '@/types/report'

interface ReportResultCellProps {
  report: IReport
}

export function ReportResultCell({ report }: ReportResultCellProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Helper to format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm')
  }

  // For reports that have an assignee
  const renderAssignee = () => {
    if (!report.assignee) return null

    return (
      <div className='flex items-center gap-2 w-full'>
        <div className='flex-shrink-0'>
          {report.assignee.avatar ? (
            <img
              src={report.assignee.avatar}
              alt={report.assignee.username}
              className='h-8 w-8 rounded-full object-cover'
            />
          ) : (
            <div className='h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center'>
              <span className='text-sm font-medium text-gray-500'>
                {report.assignee.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center'>
            <span className='font-medium text-gray-700 text-sm mr-1'>Assigned to:</span>
            <span className='font-medium text-gray-900 text-sm'>{report.assignee.username}</span>
          </div>
          <p className='text-sm text-gray-500 mt-0.5'>{formatDate(report.updatedAt)}</p>
        </div>
      </div>
    )
  }

  // For reports with result note
  const renderResultNote = () => {
    if (!report.resultNote) return null

    return (
      <div className='mt-2 rounded bg-blue-50 p-3 w-full'>
        <div className='flex gap-2'>
          <AlertCircleIcon className='h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5' />
          <div className='flex-1 min-w-0'>
            <div className='text-sm text-blue-700 font-medium'>Result:</div>
            <p className='text-sm text-blue-600 break-words mt-1'>{report.resultNote}</p>
          </div>
        </div>
      </div>
    )
  }

  // For reports with files
  const renderFiles = () => {
    if (!report.files || report.files.length === 0) return null

    const fileCount = report.files.length

    return (
      <div className='mt-3 w-full'>
        <div className='text-sm text-gray-500 mb-2'>Evidence media: {fileCount} media attached</div>
        <div className='grid grid-cols-3 gap-3'>
          {report.files.map((file) => (
            // Clicking on any image will open a fullscreen dialog
            <ImagePreviewThumbnail key={file.id} imageUrl={file.fileUrl} alt={file.name || 'Evidence media'} />
          ))}
        </div>
      </div>
    )
  }

  const toggleDetails = () => {
    setIsDetailsOpen(!isDetailsOpen)
  }

  // Display report reason in all states
  const renderReason = () => (
    <div className='flex items-start gap-2 mb-2'>
      <FileTextIcon className='h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5' />
      <div className='flex-1 text-sm'>
        <span className='text-gray-500'>Reason:</span> <span className='text-gray-900'>{report.reason}</span>
      </div>
    </div>
  )

  // Render file toggle button
  const renderFileToggle = () => {
    if (!report.files || report.files.length === 0) return null

    const fileCount = report.files.length

    return (
      <div className='flex items-center ml-auto'>
        <span className='text-sm text-blue-500 mr-1.5 whitespace-nowrap'>{fileCount} media attached</span>
        <Button variant='ghost' size='sm' className='h-7 w-7 p-0' onClick={toggleDetails}>
          {isDetailsOpen ? (
            <ChevronUp className='h-4 w-4 text-gray-500' />
          ) : (
            <ChevronDown className='h-4 w-4 text-gray-500' />
          )}
        </Button>
      </div>
    )
  }

  // Return different UI based on status
  switch (report.status) {
    case ReportStatusEnum.PENDING:
      return (
        <div className='w-full'>
          <div className='flex items-start'>
            <div className='flex-1'>
              {renderReason()}
              <div className='flex items-center gap-1.5'>
                <span className='bg-amber-100 w-2 h-2 rounded-full'></span>
                <span className='text-sm font-medium text-amber-600'>Awaiting review</span>
              </div>
            </div>
            {renderFileToggle()}
          </div>
          {isDetailsOpen && renderFiles()}
        </div>
      )

    case ReportStatusEnum.IN_PROCESSING:
      return (
        <div className='w-full'>
          <div className='flex items-start'>
            <div className='flex-1'>
              {renderReason()}
              {renderAssignee()}
              <div className='flex items-center gap-1.5 mt-1.5'>
                <FolderIcon className='h-4 w-4 text-blue-500' />
                <span className='text-sm font-medium text-blue-600'>In progress</span>
              </div>
            </div>
            {renderFileToggle()}
          </div>
          {isDetailsOpen && renderFiles()}
        </div>
      )

    case ReportStatusEnum.APPROVED:
      return (
        <div className='w-full'>
          <div className='flex items-start'>
            <div className='flex-1'>
              {renderReason()}
              {renderAssignee()}
              {renderResultNote()}
            </div>
            {renderFileToggle()}
          </div>
          {isDetailsOpen && renderFiles()}
        </div>
      )

    case ReportStatusEnum.CANCELLED: {
      const cancelDate = formatDate(report.updatedAt)
      return (
        <div className='w-full'>
          {renderReason()}
          <div className='flex items-center gap-1.5'>
            <span className='bg-red-100 w-2 h-2 rounded-full'></span>
            <span className='text-sm font-medium text-red-600'>
              Cancelled by {report.assignee?.username || 'admin'}
            </span>
            <span className='text-sm text-gray-500 ml-1'>({cancelDate})</span>
          </div>
        </div>
      )
    }

    default:
      return (
        <div className='text-sm text-gray-500 w-full'>
          <span>No data available</span>
        </div>
      )
  }
}
