import { ChevronDown, ChevronUp, FileTextIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ImagePreviewThumbnail } from '@/components/image-preview'
import { Button } from '@/components/ui/button'
import { TOrderRequest } from '@/types/order-request'

interface OrderRequestReasonCellProps {
  request: TOrderRequest
}

export function OrderRequestReasonCell({ request }: OrderRequestReasonCellProps) {
  const { t } = useTranslation()
  const [isMediaExpanded, setIsMediaExpanded] = useState(false)

  const toggleMediaExpanded = () => {
    setIsMediaExpanded(!isMediaExpanded)
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

  const renderMediaFiles = () => {
    if (!request.mediaFiles || request.mediaFiles.length === 0) return null

    return (
      <div className='mt-3 w-full'>
        <div className='flex items-center justify-between mb-2'>
          <h4 className='text-sm font-medium'>
            {t('order.request.attachments', 'Attachments')} ({request.mediaFiles.length})
          </h4>
        </div>
        <div className='grid grid-cols-3 gap-3'>
          {request.mediaFiles.map((file) => (
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

  const hasMediaFiles = request.mediaFiles && request.mediaFiles.length > 0

  return (
    <div className='w-full rounded-md overflow-hidden'>
      <div className='p-2'>
        <div className='flex items-start space-x-2'>
          <div className='flex-shrink-0 flex items-center justify-center w-6 h-6 bg-indigo-50 text-indigo-600 rounded-md mt-0.5'>
            <FileTextIcon className='h-3.5 w-3.5' />
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center justify-between w-full'>
              <div className='text-sm break-words pr-2 flex-1'>
                {request.reason || t('order.request.noReason', 'No reason provided')}
              </div>
              {hasMediaFiles && (
                <Button variant='ghost' size='sm' className='h-7 px-2 flex-shrink-0 ml-2' onClick={toggleMediaExpanded}>
                  {isMediaExpanded ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
                </Button>
              )}
            </div>
            {isMediaExpanded && renderMediaFiles()}
          </div>
        </div>
      </div>
    </div>
  )
}
