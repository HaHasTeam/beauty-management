import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface DeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  item: string
  title?: string
  description?: string
}

export default function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  item,
  title,
  description
}: DeleteConfirmationDialogProps) {
  const { t } = useTranslation()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader className='flex flex-row items-start gap-4'>
          <AlertTriangle className='mt-2 h-6 w-6 text-orange-500' />
          <div className='flex-1 gap-2 items-start'>
            <DialogTitle className='text-lg'>{title ?? t(`delete.${item}.title`)}</DialogTitle>
            <DialogDescription className='text-base'>
              {description ?? t(`delete.${item}.description`)}
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className='flex justify-end gap-2 mt-4'>
          <Button
            variant='outline'
            className='border border-primary text-primary hover:text-primary hover:bg-primary/10'
            onClick={() => onOpenChange(false)}
          >
            {t(`delete.${item}.cancel`)}
          </Button>
          <Button onClick={() => onConfirm()}>{t(`delete.${item}.confirm`)}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
