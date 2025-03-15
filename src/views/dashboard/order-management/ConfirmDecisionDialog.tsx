import { Component, Info } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import LoadingIcon from '@/components/loading-icon'
import ViewMediaSection from '@/components/media/ViewMediaSection'
import SectionCollapsable from '@/components/section-collapsable'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RequestStatusEnum } from '@/types/enum'
import { TServerFile } from '@/types/file'
import { IReturnRequestOrder } from '@/types/order'

import RejectRejectReturn from './RejectRejectReturnDialog'
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
  isRejectRequest?: boolean
  reason?: string
  rejectReason?: string
  mediaFiles?: TServerFile[]
  rejectMediaFiles?: TServerFile[]
  returnRequest: IReturnRequestOrder
  status: RequestStatusEnum
  rejectStatus?: RequestStatusEnum
  reasonRejected?: string | null
  rejectRequestId?: string
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
  reason,
  isRejectRequest,
  rejectReason,
  rejectMediaFiles,
  rejectStatus,
  status,
  reasonRejected,
  rejectRequestId
}: ConfirmDecisionDialogProps) {
  const { t } = useTranslation()
  const [openRejectDialog, setOpenRejectDialog] = useState<boolean>(false)
  console.log(item)
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-2xl gap-2'>
          <ScrollArea className='max-h-[80vh]'>
            <div className='space-y-3 mr-2'>
              <DialogHeader className='flex flex-row items-start gap-2'>
                <Info className='mt-2 h-6 w-6 text-primary' />
                <div className='flex-1 gap-2 items-start'>
                  <DialogTitle className='text-lg text-primary'>{title ?? t(`confirm.${item}.title`)}</DialogTitle>
                  <DialogDescription className='text-base'>
                    {description ?? t(`confirm.${item}.description`)}
                  </DialogDescription>
                </div>
              </DialogHeader>
              <div className='space-y-3'>
                <SectionCollapsable
                  header={
                    <div className='text-primary flex gap-1 items-center'>
                      <Component size={16} />
                      <h2 className='font-semibold text-primary text-base'>{t(`confirm.${item}.cus`)}</h2>
                    </div>
                  }
                  content={
                    <div className='space-y-2'>
                      {reason && (
                        <div className='flex gap-2 items-center'>
                          <h3 className='font-medium text-primary'>{t('order.cancelOrderReason.reason')}:</h3>
                          <span>{reason}</span>
                        </div>
                      )}
                      {mediaFiles && mediaFiles?.length > 0 && (
                        <div className='space-y-2'>
                          <h3 className='font-medium text-primary'> {t('order.proof')}</h3>
                          <ViewMediaSection mediaFiles={mediaFiles} />
                        </div>
                      )}
                    </div>
                  }
                />

                {isRejectRequest && (
                  <SectionCollapsable
                    header={
                      <div className='text-primary flex gap-1 items-center'>
                        <Component size={16} />
                        <h2 className='font-semibold text-primary text-base'>{t(`confirm.${item}.brand`)}</h2>
                      </div>
                    }
                    content={
                      <div className='space-y-2'>
                        {(status === RequestStatusEnum.APPROVED || status === RequestStatusEnum.REJECTED) && (
                          <div className='flex gap-2 items-center'>
                            <h3 className='font-medium text-primary'>{t('return.decision')}:</h3>
                            <span>
                              {status === RequestStatusEnum.APPROVED
                                ? t('requestStatus.approved')
                                : t('requestStatus.rejected')}
                            </span>
                          </div>
                        )}
                        {rejectReason && (
                          <div className='flex gap-2 items-center'>
                            <h3 className='font-medium text-primary'>{t('order.cancelOrderReason.reason')}:</h3>
                            <span>{rejectReason}</span>
                          </div>
                        )}
                        {rejectMediaFiles && rejectMediaFiles?.length > 0 && (
                          <div className='space-y-2'>
                            <h3 className='font-medium text-primary'> {t('order.proof')}</h3>
                            <ViewMediaSection mediaFiles={rejectMediaFiles} />
                          </div>
                        )}
                      </div>
                    }
                  />
                )}
                {rejectStatus && rejectStatus !== RequestStatusEnum.PENDING && (
                  <SectionCollapsable
                    header={
                      <div className='text-primary flex gap-1 items-center'>
                        <Component size={16} />
                        <h2 className='font-semibold text-primary text-base'>{t(`confirm.${item}.admin`)}</h2>
                      </div>
                    }
                    content={
                      <div className='space-y-2'>
                        {(rejectStatus === RequestStatusEnum.APPROVED ||
                          rejectStatus === RequestStatusEnum.REJECTED) && (
                          <div className='flex gap-2 items-center'>
                            <h3 className='font-medium text-primary'>{t('return.decision')}:</h3>
                            <span>
                              {rejectStatus === RequestStatusEnum.APPROVED
                                ? t('requestStatus.approved')
                                : t('requestStatus.rejected')}
                            </span>
                          </div>
                        )}
                        {reasonRejected && (
                          <div className='flex gap-2 items-center'>
                            <h3 className='font-medium text-primary'>{t('order.cancelOrderReason.reason')}:</h3>
                            <span>{reasonRejected}</span>
                          </div>
                        )}
                      </div>
                    }
                  />
                )}
              </div>
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
                    variant='outline'
                    className='border text-primary border-primary hover:bg-primary/10 hover:text-primary'
                    onClick={() => onOpenChange(false)}
                  >
                    {t('button.close')}
                  </Button>
                )}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      {isRejectRequest && rejectRequestId && (
        <RejectRejectReturn
          open={openRejectDialog}
          onOpenChange={setOpenRejectDialog}
          requestId={rejectRequestId}
          setOpen={setOpenRejectDialog}
          reasonItem={'rejectBrandRejectionReason'}
          dialogTitle={'rejectRequestRejectOrder'}
          successTitle={'successMakeDecisionOnReject'}
          dialogMessage={'rejectRequestRejectOrderMessage'}
          item={item}
        />
      )}
      {item === 'returnTrackView' && (
        <RejectReturnOrderDialog
          open={openRejectDialog}
          onOpenChange={setOpenRejectDialog}
          returnRequest={returnRequest}
          setOpen={setOpenRejectDialog}
        />
      )}
      {item === 'decisionComplaint' && (
        <RejectRejectReturn
          open={openRejectDialog}
          onOpenChange={setOpenRejectDialog}
          requestId={returnRequest.id}
          setOpen={setOpenRejectDialog}
          reasonItem={'rejectComplaintReason'}
          dialogTitle={'rejectComplaintTitle'}
          successTitle={'successMakeDecisionOnComplaint'}
          dialogMessage={'rejectComplaintMessage'}
          item={item}
        />
      )}
    </>
  )
}
