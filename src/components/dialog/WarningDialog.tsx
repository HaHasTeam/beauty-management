import { Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface WarningDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  item: string
  title?: string
  description?: string
}

export default function WarningDialog({ open, onOpenChange, onConfirm, item, title, description }: WarningDialogProps) {
  const { t } = useTranslation()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader className='flex flex-row items-start gap-4'>
          <Info className='mt-2 h-6 w-6 text-orange-500' />
          <div className='flex-1 gap-2 items-start'>
            <DialogTitle className='text-lg'>{title ?? t(`warning.${item}.title`)}</DialogTitle>
            <DialogDescription className='text-base'>
              {description ?? t(`warning.${item}.description`)}
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className='flex justify-end gap-2 mt-4'>
          <Button onClick={() => onConfirm()}>{t(`warning.${item}.confirm`)}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
