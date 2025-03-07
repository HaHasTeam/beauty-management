import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import LoadingIcon from '@/components/loading-icon'
import ViewMediaSection from '@/components/media/ViewMediaSection'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RequestStatusEnum } from '@/types/enum'
import { TServerFile } from '@/types/file'
import { IReturnRequestOrder } from '@/types/order'

import { RejectReturnOrderDialog } from './RejectReturnOrderDialog'

interface ConfirmDecisionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (status: string) => void
  item: string
  title?: string
  description?: string
  isLoadingDecisionRejected?: boolean
  isLoadingDecisionApproved?: boolean
  isShowAction?: boolean
  reason?: string
  mediaFiles?: TServerFile[]
  returnRequest: IReturnRequestOrder
}

export default function ConfirmDecisionDialog({
  open,
  onOpenChange,
  onConfirm,
  item,
  title,
  description,
  isLoadingDecisionRejected,
  isLoadingDecisionApproved,
  isShowAction = true,
  mediaFiles = [],
  returnRequest,
  reason
}: ConfirmDecisionDialogProps) {
  const { t } = useTranslation()
  const [openRejectDialog, setOpenRejectDialog] = useState<boolean>(false)
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
          {reason && (
            <div className='flex gap-2'>
              <h3 className='font-medium text-primary'> {t('order.cancelOrderReason.reason')}</h3>
              <span>{reason}</span>
            </div>
          )}
          {mediaFiles && mediaFiles?.length > 0 && <ViewMediaSection mediaFiles={mediaFiles} />}
          <div className='flex justify-end gap-2 mt-4'>
            {isShowAction ? (
              <>
                <Button
                  variant='outline'
                  className='border text-destructive bg-white border-destructive hover:text-destructive hover:bg-destructive/10'
                  onClick={() => setOpenRejectDialog(true)}
                >
                  {isLoadingDecisionRejected ? <LoadingIcon /> : t('button.rejected')}
                </Button>
                <Button
                  variant='default'
                  className='border text-white bg-green-500 hover:text-white hover:bg-green-400'
                  onClick={() => onConfirm(RequestStatusEnum.APPROVED)}
                >
                  {isLoadingDecisionApproved ? <LoadingIcon /> : t('button.approved')}
                </Button>
              </>
            ) : (
              <Button
                variant='default'
                className='border text-primary border-primary hover:bg-primary/10'
                onClick={() => onOpenChange(false)}
              >
                {t('button.close')}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <RejectReturnOrderDialog
        open={openRejectDialog}
        onOpenChange={setOpenRejectDialog}
        returnRequest={returnRequest}
        setOpen={setOpenRejectDialog}
      />
    </>
  )
}
