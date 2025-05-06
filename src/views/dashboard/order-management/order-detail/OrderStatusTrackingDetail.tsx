import { Check, Eye, Package } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import RoleTag from '@/components/account/RoleTag'
import ViewMediaDialog from '@/components/dialog/ViewMediaDialog'
import { StatusTrackingIcon, StatusTrackingText } from '@/components/status-tracking-order/StatusTrackingOrder'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { RequestStatusEnum, ShippingStatusEnum } from '@/types/enum'
import { ICancelAndReturnRequest } from '@/types/order'
import { UserRoleEnum } from '@/types/role'
import { IStatusTracking } from '@/types/status-tracking'

interface IStep {
  status: string
  createdAt: Date | string
  text: string
  icon: JSX.Element
  reason: string | null
  updatedBy: string
  updatedPerson: string
  reviewRole: string
  reviewPerson: string
}
interface OrderStatusTrackingDetailProps {
  statusTrackingData: IStatusTracking[]
  cancelAndReturnRequest?: ICancelAndReturnRequest
  orderCreatedAt: string
}
const OrderStatusTrackingDetail = ({
  orderCreatedAt,
  statusTrackingData,
  cancelAndReturnRequest
}: OrderStatusTrackingDetailProps) => {
  const { t } = useTranslation()
  const [openMediaStep, setOpenMediaStep] = useState<number | null>(null)

  const defaultTimeline = [
    {
      status: 'ORDER_CREATED',
      createdAt: orderCreatedAt,
      text: t('order.created'),
      icon: <Package className='w-5 h-5' />,
      reason: '',
      updatedBy: '',
      mediaFiles: [],
      updatedPerson: '',
      reviewRole: '',
      reviewPerson: ''
    }
  ]

  const databaseTimeline = statusTrackingData.map((tracking) => ({
    status: tracking.status,
    createdAt: tracking.createdAt,
    mediaFiles: tracking.mediaFiles,
    text: StatusTrackingText(tracking.status),
    icon: StatusTrackingIcon(tracking.status),
    reason: tracking.reason,
    // updatedBy: t(
    //   `role.${tracking.updatedBy?.role?.role === UserRoleEnum.MANAGER || tracking.updatedBy?.role?.role === UserRoleEnum.STAFF ? 'BRAND' : tracking.updatedBy?.role.role}`
    // )
    updatedBy: tracking.updatedBy ? t(`${tracking.updatedBy?.role?.role}`) : '',
    updatedPerson: tracking.updatedBy?.username,
    reviewRole:
      (tracking.status === ShippingStatusEnum.CANCELLED || tracking.status === RequestStatusEnum.APPROVED
        ? cancelAndReturnRequest?.cancelRequest?.updatedBy?.role?.role
        : '') ?? '',
    reviewPerson:
      (tracking.status === ShippingStatusEnum.CANCELLED || tracking.status === RequestStatusEnum.APPROVED
        ? cancelAndReturnRequest?.cancelRequest?.updatedBy?.username
        : '') ?? ''
  }))

  const timeline = [...defaultTimeline, ...databaseTimeline]
  const currentStatus = statusTrackingData[statusTrackingData.length - 1]?.status
  const currentIndex = timeline.findIndex((step) => step.status === currentStatus)

  const isComplete = (step: IStep, index: number) => {
    const status = step.status
    return (
      (status === ShippingStatusEnum.COMPLETED && index === timeline.length - 1) ||
      status === ShippingStatusEnum.CANCELLED ||
      step.status === RequestStatusEnum.APPROVED ||
      status === ShippingStatusEnum.REFUNDED ||
      status === ShippingStatusEnum.RETURNED_FAIL
    )
  }
  return (
    <div className='mx-auto'>
      <div className=''>
        {timeline.map((step, index) => (
          <div key={index} className='flex items-start gap-4'>
            <div className='flex flex-col items-center justify-center'>
              {isComplete(step, index) ? (
                <div className={`w-4 h-4 flex items-center justify-center bg-emerald-500 rounded-full`}>
                  <Check className='w-3 h-3 text-white' />
                </div>
              ) : (
                <div className={`w-4 h-4 ${currentIndex === index ? 'bg-emerald-500' : 'bg-muted'} rounded-full`} />
              )}
              {index !== timeline.length - 1 && <div className='w-0.5 h-8 bg-muted' />}
              {/* {index === timeline.length - 1 && <div className="w-3 h-3 bg-muted rounded-full" />} */}
            </div>
            <div className='flex gap-2 items-start'>
              <div
                className={`text-sm min-w-fit ${currentIndex === index ? 'text-emerald-500' : 'text-muted-foreground'}`}
              >
                {t('date.toLocaleDateTimeString', { val: new Date(step?.createdAt) })}
              </div>
              <div className='flex flex-col'>
                <div
                  className={`flex gap-1 items-center text-sm font-medium ${currentIndex === index ? 'text-emerald-500' : 'text-muted-foreground'}`}
                >
                  {step.status === RequestStatusEnum.APPROVED
                    ? t('order.approvedCancelRequest')
                    : step.status === RequestStatusEnum.REJECTED
                      ? t('order.rejectedCancelRequest')
                      : StatusTrackingText(step.status)}
                  {step.mediaFiles && step.mediaFiles.length > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Eye
                            size={16}
                            className='text-gray-500 hover:text-gray-800 cursor-pointer hover:bg-gray-100 transition-colors'
                            onClick={() => setOpenMediaStep(index)}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('media.viewMediaFiles')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>

                {(step.status === ShippingStatusEnum.CANCELLED || step.status === RequestStatusEnum.APPROVED) && (
                  <div>
                    <div className='flex items-center gap-1 text-sm text-muted-foreground mt-1'>
                      <span className='font-medium'>{t('orderDetail.cancelBy')}: </span>
                      {step.updatedPerson}
                      {step.updatedBy && step.updatedBy !== '' && (
                        <div>
                          <RoleTag role={(step.updatedBy as UserRoleEnum) || UserRoleEnum.CUSTOMER} size='small' />
                        </div>
                      )}
                    </div>

                    <div className='text-sm text-muted-foreground mt-1'>
                      <span className='font-medium'>{t('order.cancelOrderReason.reason')}: </span>
                      {step.reason}
                    </div>

                    {step.reviewPerson && (
                      <div className='flex items-center gap-1 text-sm text-muted-foreground mt-1'>
                        <span className='font-medium'>{t('orderDetail.approvedBy')}: </span>
                        {step.reviewPerson}
                        {step.reviewRole && step.reviewRole !== '' && (
                          <div>
                            <RoleTag role={(step.reviewRole as UserRoleEnum) || UserRoleEnum.CUSTOMER} size='small' />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {step.status !== ShippingStatusEnum.WAIT_FOR_CONFIRMATION &&
                  step.status !== ShippingStatusEnum.CANCELLED &&
                  step.status !== RequestStatusEnum.APPROVED &&
                  step.updatedBy && (
                    <div className='flex items-center gap-1 text-sm text-muted-foreground mt-1 mb-2'>
                      <span className='font-medium'>{t('orderDetail.updatedBy')}: </span>
                      {step.updatedPerson}
                      {step.updatedBy && step.updatedBy !== '' && (
                        <div>
                          <RoleTag role={(step.updatedBy as UserRoleEnum) || UserRoleEnum.CUSTOMER} size='small' />
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>
            {openMediaStep !== null && timeline[openMediaStep]?.mediaFiles && (
              <ViewMediaDialog
                mediaFiles={timeline[openMediaStep].mediaFiles}
                open={openMediaStep !== null}
                onOpenChange={() => setOpenMediaStep(null)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrderStatusTrackingDetail
