import * as React from 'react'

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface PreviewDialogProps {
  trigger: React.ReactNode
  content: React.ReactNode | string
  contentType?: 'image' | 'text'
  className?: string
}

export function PreviewDialog({ trigger, content, contentType, className }: PreviewDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={cn('xl:max-w-3xl p-5 flex items-center flex-col', className)}>
        <DialogTitle>Preview Image</DialogTitle>
        {contentType === 'image' && typeof content === 'string' ? (
          <div className='aspect-auto rounded-xl overflow-hidden shadow-md border flex items-center justify-center object-contain'>
            <img src={content} alt='Preview' />
          </div>
        ) : (
          <div className='p-6'>{content}</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
