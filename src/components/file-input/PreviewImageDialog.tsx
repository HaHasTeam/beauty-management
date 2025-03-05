import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface PreviewDialogProps {
  trigger: React.ReactNode
  content: React.ReactNode | string
  contentType?: 'image' | 'text' | 'video'
  className?: string
}

export function PreviewDialog({ trigger, content, contentType, className }: PreviewDialogProps) {
  const { t } = useTranslation()
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={cn('sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl overflow-hidden', className)}>
        <DialogTitle className='text-lg font-medium'>{t('media.previewImage')}</DialogTitle>
        <div className='overflow-y-auto max-h-96 min-h-80'>
          {contentType === 'image' && typeof content === 'string' ? (
            <div className='flex items-center justify-center'>
              <img
                src={content}
                alt='Preview'
                className='max-h-80 min-h-72 w-auto object-contain rounded-lg shadow-md'
              />
            </div>
          ) : contentType === 'video' && typeof content === 'string' ? (
            <div className='flex items-center justify-center'>
              <video src={content} controls className='max-h-80 min-h-72  w-auto object-contain rounded-lg' />
            </div>
          ) : (
            <div>{content}</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
