import { format } from 'date-fns'
import { AlertCircleIcon, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ImagePreviewThumbnail } from '@/components/image-preview'
import { Button } from '@/components/ui/button'
import { TOrderRequest } from '@/types/order-request'

interface OrderRequestResultCellProps {
  request: TOrderRequest
}

export function OrderRequestResultCell({ request }: OrderRequestResultCellProps) {
  const { t } = useTranslation()
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Helper to format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm')
  }

  // Helper function to determine file type from URL or extension
  const getFileType = (url: string): string => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.wmv', '.flv', '.mkv']
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg']

    const extension = url.split('?')[0].substring(url.lastIndexOf('.')).toLowerCase()

    if (videoExtensions.some((ext) => extension.includes(ext))) {
      return 'video/mp4' // Default video type
    } else if (imageExtensions.some((ext) => extension.includes(ext))) {
      return 'image/jpeg' // Default image type
    }

    return '' // Unknown type
  }

  // For requests that have a processor
  const renderProcessor = () => {
    if (!request.updatedBy) return null

    return (
      <div className='flex items-center space-x-3 w-full'>
        <div className='flex-shrink-0'>
          {request.updatedBy.avatar ? (
            <img
              src={request.updatedBy.avatar}
              alt={request.updatedBy.username}
              className='h-8 w-8 rounded-full object-cover'
            />
          ) : (
            <div className='h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center'>
              <span className='text-xs font-medium text-gray-500'>
                {request.updatedBy.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className='flex flex-col min-w-0'>
          <div className='flex items-center'>
            <span className='text-sm font-medium mr-1'>{t('order.request.processedBy', 'Processed by')}:</span>
            <span className='text-sm font-semibold'>{request.updatedBy.username}</span>
          </div>
          <p className='text-xs text-gray-500'>{formatDate(request.updatedAt)}</p>
        </div>
      </div>
    )
  }

  // For rejected requests
  const renderRejectionReason = () => {
    const reason = request.reasonRejected || request.rejectedRefundRequest?.reason
    if (!reason) return null

    return (
      <div className='mt-2 rounded-md bg-red-50 p-3 w-full'>
        <div className='flex'>
          <div className='flex-shrink-0'>
            <AlertCircleIcon className='h-5 w-5 text-red-400' />
          </div>
          <div className='ml-3 flex-1 min-w-0'>
            <h3 className='text-sm font-medium text-red-800'>
              {t('order.request.rejectionReason', 'Rejection Reason')}:
            </h3>
            <div className='mt-1 text-sm text-red-700'>
              <p className='break-words'>{reason}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // For completed requests with media files
  const renderMediaFiles = () => {
    const mediaFiles = request.mediaFiles || request.rejectedRefundRequest?.mediaFiles
    if (!mediaFiles || mediaFiles.length === 0) return null

    return (
      <div className='mt-3 w-full'>
        <div className='flex items-center justify-between mb-2'>
          <h4 className='text-sm font-medium'>
            {t('order.request.evidenceFiles', 'Evidence Files')} ({mediaFiles.length})
          </h4>
        </div>
        <div className='grid grid-cols-3 gap-3'>
          {mediaFiles.map((file) => (
            <ImagePreviewThumbnail
              key={file.id}
              imageUrl={file.fileUrl}
              alt={file.name || t('order.request.media', 'Media')}
              fileType={getFileType(file.fileUrl)}
            />
          ))}
        </div>
      </div>
    )
  }

  const toggleDetails = () => {
    setIsDetailsOpen(!isDetailsOpen)
  }

  // Return different UI based on status
  switch (request.status) {
    case 'PENDING':
      return (
        <div className='text-sm text-gray-600 w-full'>
          <span>{t('order.request.awaitingReview', 'Awaiting review')}</span>
        </div>
      )

    case 'APPROVED':
      return (
        <div className='w-full'>
          {renderProcessor()}
          <div className='mt-2 text-xs text-gray-500'>
            {request.updatedBy?.role.role
              ? t('order.request.beingProcessedByRole', 'Being processed by {{role}}', {
                  role: request.updatedBy.role.role
                })
              : t('order.request.beingProcessed', 'Being processed')}
          </div>
        </div>
      )

    case 'REJECTED':
      return (
        <div className='w-full'>
          <div className='flex items-center justify-between w-full'>
            <div className='flex-1 min-w-0'>{renderProcessor()}</div>
            <Button variant='ghost' size='sm' className='h-7 px-2 flex-shrink-0 ml-2' onClick={toggleDetails}>
              {isDetailsOpen ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
            </Button>
          </div>
          {isDetailsOpen && (
            <div className='mt-2'>
              {renderRejectionReason()}
              {renderMediaFiles()}
            </div>
          )}
        </div>
      )

    default:
      return (
        <div className='w-full'>
          <div className='flex items-center justify-between w-full'>
            <div className='flex-1 min-w-0'>{renderProcessor()}</div>
            {request.mediaFiles && request.mediaFiles.length > 0 && (
              <Button variant='ghost' size='sm' className='h-7 px-2 flex-shrink-0 ml-2' onClick={toggleDetails}>
                {isDetailsOpen ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
              </Button>
            )}
          </div>
          {isDetailsOpen && renderMediaFiles()}
        </div>
      )
  }
}
