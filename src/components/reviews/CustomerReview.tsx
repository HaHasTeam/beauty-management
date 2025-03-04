import { useTranslation } from 'react-i18next'

import { IClassification } from '@/types/classification'
import { TServerFile } from '@/types/file'

import ViewMediaSection from '../media/ViewMediaSection'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Ratings } from '../ui/rating'

interface CustomerReviewProps {
  authorName: string
  authorAvatar: string
  updatedAt: string
  classification: IClassification | null
  numberOfItem: number
  description: string
  mediaFiles: TServerFile[]
  rating: number
  onReplyClick: () => void
}
const CustomerReview = ({
  authorName,
  authorAvatar,
  updatedAt,
  classification,
  numberOfItem,
  rating,
  description,
  mediaFiles,
  onReplyClick
}: CustomerReviewProps) => {
  const { t } = useTranslation()
  return (
    <div className='flex flex-col gap-1'>
      <div>
        <div className='flex gap-3 items-center'>
          <Avatar>
            <AvatarImage src={authorAvatar} alt={authorName} />
            <AvatarFallback>{authorName?.charAt(0) ?? 'A'}</AvatarFallback>
          </Avatar>
          <span className='font-semibold'>{authorName}</span>
        </div>
      </div>
      <div className='flex gap-3'>
        <Ratings rating={rating} variant='yellow' size={13} />
      </div>
      <div className='flex gap-2 text-sm text-gray-500'>
        {classification && (
          <div>
            <span>{t('createProduct.classification')}: </span>
            <span>
              {[
                classification?.color && `${classification.color}`,
                classification?.size && `${classification.size}`,
                classification?.other && `${classification.other}`
              ]
                .filter(Boolean)
                .join(', ')}
            </span>
          </div>
        )}
        <div className='border-l border-gray-200 px-2'>
          <span>{t('createProduct.quantity')}: </span>
          <span>{numberOfItem}</span>
        </div>
      </div>
      <div>
        <p>{description}</p>
      </div>
      <div className='flex gap-2 flex-wrap'>
        <div className='flex gap-2 flex-wrap'>{mediaFiles && <ViewMediaSection mediaFiles={mediaFiles} />}</div>
      </div>
      <div className='flex items-center gap-2'>
        <span className='text-muted-foreground font-medium text-xs'>
          {t('date.toLocaleDateTimeString', { val: new Date(updatedAt) })}
        </span>
        <Button
          variant='ghost'
          size='sm'
          className='border-0 outline-0 text-muted-foreground hover:bg-transparent hover:text-muted-foreground/80'
          onClick={onReplyClick}
        >
          {t('feedback.reply')}
        </Button>
      </div>
    </div>
  )
}

export default CustomerReview
