import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import ConfirmDialog from '@/components/dialog/ConfirmDialog'
import LoadingIcon from '@/components/loading-icon'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RequestStatusEnum } from '@/types/enum'

interface ConfirmDecisionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (status: string) => void
  item: string
  title?: string
  description?: string
  isLoadingDecisionRejected?: boolean
  isLoadingDecisionApproved?: boolean
}

export default function ConfirmDecisionDialog({
  open,
  onOpenChange,
  onConfirm,
  item,
  title,
  description,
  isLoadingDecisionRejected,
  isLoadingDecisionApproved
}: ConfirmDecisionDialogProps) {
  const { t } = useTranslation()
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false)
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader className='flex flex-row items-start gap-4'>
            <AlertTriangle className='mt-2 h-6 w-6 text-orange-500' />
            <div className='flex-1 gap-2 items-start'>
              <DialogTitle className='text-lg'>{title ?? t(`confirm.${item}.title`)}</DialogTitle>
              <DialogDescription className='text-base'>
                {description ?? t(`confirm.${item}.description`)}
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className='flex justify-end gap-2 mt-4'>
            <Button
              variant='outline'
              className='w-full border text-destructive bg-white border-destructive hover:text-destructive hover:bg-destructive/10'
              onClick={() => onConfirm(RequestStatusEnum.REJECTED)}
            >
              {isLoadingDecisionRejected ? <LoadingIcon /> : t('button.rejected')}
            </Button>
            <Button
              variant='default'
              className='w-full border text-white bg-green-500 hover:text-white hover:bg-green-400'
              onClick={() => setOpenConfirmDialog(true)}
            >
              {isLoadingDecisionApproved ? <LoadingIcon /> : t('button.approved')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={openConfirmDialog}
        onOpenChange={setOpenConfirmDialog}
        onConfirm={() => onConfirm(RequestStatusEnum.APPROVED)}
        item={'decisionReturn'}
      />
    </>
  )
}
