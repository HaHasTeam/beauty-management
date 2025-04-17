import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ImagePreviewThumbnail } from '@/components/image-preview'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { OrderRequestTypeEnum } from '@/types/enum'
import { TOrderRequest } from '@/types/order-request'

interface OrderRequestReasonMakerCellProps {
  request: TOrderRequest
}

export function OrderRequestReasonMakerCell({ request }: OrderRequestReasonMakerCellProps) {
  const { t } = useTranslation()
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const getMaker = () => {
    if (!request.order) return null

    // For REFUND and CANCEL requests, maker is the account
    if (request.type === OrderRequestTypeEnum.REFUND || request.type === OrderRequestTypeEnum.CANCEL) {
      return {
        name: request.order.account?.username || 'Unknown Account',
        avatar: request.order.account?.avatar,
        fallback: request.order.account?.username?.charAt(0).toUpperCase() || 'U',
        isBrand: false
      }
    }

    // For REJECT_REFUND and COMPLAINT requests, maker is the brand
    if (request.type === OrderRequestTypeEnum.REJECT_REFUND || request.type === OrderRequestTypeEnum.COMPLAINT) {
      return {
        name: request.order.brand?.name || 'Unknown Brand',
        avatar: request.order.brand?.logo,
        fallback: request.order.brand?.name?.charAt(0).toUpperCase() || 'B',
        isBrand: true
      }
    }

    return null
  }

  const maker = getMaker()

  if (!maker) {
    return <div className='text-sm text-gray-500'>{t('order.request.unknownMaker', 'Unknown Maker')}</div>
  }

  const name = maker.name
  const avatarUrl = maker.avatar || ''

  const initial = name ? name.charAt(0).toUpperCase() : '?'

  const toggleDetails = () => {
    setIsDetailsOpen(!isDetailsOpen)
  }

  const renderMediaFiles = () => {
    if (!request.mediaFiles || request.mediaFiles.length === 0) return null

    return (
      <div className='mt-3 w-full'>
        <div className='flex items-center justify-between mb-2'>
          <h4 className='text-sm font-medium'>
            {t('order.request.evidenceFiles', 'Evidence Files')} ({request.mediaFiles.length})
          </h4>
        </div>
        <div className='grid grid-cols-3 gap-3'>
          {request.mediaFiles.map((file) => (
            <ImagePreviewThumbnail
              key={file.id}
              imageUrl={file.fileUrl}
              alt={file.name || t('order.request.media', 'Media')}
              fileType={file.type}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between w-full'>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center space-x-3 w-full'>
            <div className='flex-shrink-0'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback className='text-xs font-medium text-gray-500'>{initial}</AvatarFallback>
              </Avatar>
            </div>
            <div className='flex flex-col min-w-0'>
              <div className='flex items-center'>
                <span className='text-sm font-medium mr-1'>
                  {maker.isBrand ? t('order.request.brand', 'Brand') : t('order.request.maker', 'Maker')}:
                </span>
                <span className='text-sm font-semibold truncate'>{name}</span>
              </div>
              <p className='text-xs text-gray-500 break-words'>{request.reason}</p>
            </div>
          </div>
        </div>
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
