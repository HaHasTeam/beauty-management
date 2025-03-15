import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CircleChevronRight, Siren } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import {
  getOrderByIdApi,
  getStatusTrackingByIdApi,
  takeReceivedActionApi,
  updateOrderStatusApi
} from '@/network/apis/order'
import { UpdateOrderStatusSchema } from '@/schemas/order.schema'
import { ActionReceivedEnum, ShippingStatusEnum } from '@/types/enum'
import { ICancelRequestOrder, IOrderItem, IReturnRequestOrder } from '@/types/order'

import Button from '../button'
import { AlertDescription } from '../ui/alert'
import { ComplaintReturnOrderDialog } from './ComplaintReturnOrderDialog'
import { UploadOrderEvidenceDialog } from './UploadOrderEvidenceDialog'

interface UpdateOrderStatusProps {
  order: IOrderItem
  setOpenCancelOrderDialog: Dispatch<SetStateAction<boolean>>
  cancelOrderRequest: ICancelRequestOrder | null
  complaintRequest: IReturnRequestOrder | null
}

export default function UpdateOrderStatus({
  order,
  setOpenCancelOrderDialog,
  cancelOrderRequest,
  complaintRequest
}: UpdateOrderStatusProps) {
  const REFUND_WAITING_DAYS = 5

  const { t } = useTranslation()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOpenOrderEvidence, setIsOpenOrderEvidence] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const defaultOrderValues = {
    status: ''
  }
  const handleReset = () => {
    form.reset()
  }
  const form = useForm<z.infer<typeof UpdateOrderStatusSchema>>({
    resolver: zodResolver(UpdateOrderStatusSchema),
    defaultValues: defaultOrderValues
  })
  const { mutateAsync: updateOrderStatusFn } = useMutation({
    mutationKey: [updateOrderStatusApi.mutationKey],
    mutationFn: updateOrderStatusApi.fn,
    onSuccess: async () => {
      successToast({
        message: t('order.updateOrderStatusSuccess')
      })
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [getOrderByIdApi.queryKey] }),
        queryClient.invalidateQueries({ queryKey: [getStatusTrackingByIdApi.queryKey] })
      ])
      handleReset()
    }
  })
  const { mutateAsync: takeReceivedActionFn } = useMutation({
    mutationKey: [takeReceivedActionApi.mutationKey],
    mutationFn: takeReceivedActionApi.fn,
    onSuccess: async () => {
      successToast({
        message: t('order.updateOrderStatusSuccess')
      })
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [getOrderByIdApi.queryKey] }),
        queryClient.invalidateQueries({ queryKey: [getStatusTrackingByIdApi.queryKey] })
      ])
      handleReset()
    }
  })
  async function handleUpdateStatus(values: z.infer<typeof UpdateOrderStatusSchema>) {
    try {
      setIsLoading(true)
      await updateOrderStatusFn({ id: order?.id, status: values.status })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleServerError({
        error,
        form
      })
    }
  }
  async function handleTakeReceivedAction(action: ActionReceivedEnum) {
    try {
      setIsLoading(true)
      await takeReceivedActionFn({ id: order?.id, action: action })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleServerError({
        error
      })
    }
  }

  if (!order) return null
  const statusConfig = {
    [ShippingStatusEnum.JOIN_GROUP_BUYING]: {
      borderColor: 'border-teal-300',
      bgColor: 'bg-teal-100',
      bgTagColor: 'bg-teal-300',
      titleColor: 'text-teal-700',
      alertVariant: 'bg-teal-100 rounded-lg p-3 border',
      buttonBg: '',
      alertTitle: t('order.joinGroupBuying'),
      buttonText: '',
      alertDescription: t('order.statusDescription.joinGroupBuying'),
      nextStatus: ''
    },
    [ShippingStatusEnum.TO_PAY]: {
      borderColor: 'border-yellow-300',
      bgColor: 'bg-yellow-100',
      bgTagColor: 'bg-yellow-200',
      titleColor: 'text-yellow-500',
      alertVariant: 'bg-yellow-50 rounded-lg p-3 border',
      buttonBg: '',
      alertTitle: t('order.pending'),
      buttonText: '',
      alertDescription: t('order.statusDescription.pending'),
      nextStatus: ''
    },
    [ShippingStatusEnum.WAIT_FOR_CONFIRMATION]: {
      borderColor: 'border-lime-300',
      bgColor: 'bg-lime-100',
      bgTagColor: 'bg-lime-200',
      alertVariant: 'bg-lime-100 rounded-lg p-3 border',
      titleColor: 'text-lime-600',
      buttonBg: 'bg-purple-600 hover:bg-purple-800',
      alertTitle: t('order.waitConfirm'),
      buttonText: t('order.preparingOrder'),
      alertDescription: t('order.statusDescription.waitConfirm'),
      nextStatus: ShippingStatusEnum.PREPARING_ORDER
    },
    [ShippingStatusEnum.PREPARING_ORDER]: {
      borderColor: 'border-purple-300',
      bgColor: 'bg-purple-100',
      bgTagColor: 'bg-purple-200',
      titleColor: 'text-purple-600',
      alertVariant: 'bg-purple-100 rounded-lg p-3 border',
      buttonBg: 'bg-orange-600 hover:bg-orange-800',
      alertTitle: t('order.preparingOrder'),
      buttonText: t('order.shipping'),
      alertDescription: t('order.statusDescription.preparingOrder'),
      nextStatus: ShippingStatusEnum.TO_SHIP
    },
    [ShippingStatusEnum.TO_SHIP]: {
      borderColor: 'border-orange-300',
      bgColor: 'bg-orange-400',
      bgTagColor: 'bg-orange-200',
      titleColor: 'text-orange-600',
      alertVariant: 'bg-orange-100 rounded-lg p-3 border',
      buttonBg: 'bg-cyan-600 hover:bg-cyan-800',
      alertTitle: t('order.shipping'),
      buttonText: t('order.delivering'),
      alertDescription: t('order.statusDescription.shipping'),
      nextStatus: ShippingStatusEnum.SHIPPING
    },
    [ShippingStatusEnum.SHIPPING]: {
      borderColor: 'border-cyan-300',
      bgColor: 'bg-cyan-100',
      bgTagColor: 'bg-cyan-300',
      titleColor: 'text-cyan-600',
      alertVariant: 'bg-cyan-100 rounded-lg p-3 border',
      buttonBg: 'bg-blue-600 hover:bg-blue-800',
      alertTitle: t('order.delivering'),
      buttonText: t('order.delivered'),
      alertDescription: t('order.statusDescription.delivering'),
      nextStatus: ShippingStatusEnum.DELIVERED
    },
    [ShippingStatusEnum.DELIVERED]: {
      borderColor: 'border-blue-300',
      bgColor: 'bg-blue-100',
      bgTagColor: 'bg-blue-300',
      titleColor: 'text-blue-600',
      alertVariant: 'bg-blue-100 rounded-lg p-3 border',
      buttonBg: '',
      alertTitle: t('order.delivered'),
      buttonText: '',
      alertDescription: t('order.statusDescription.delivered'),
      nextStatus: ''
    },
    [ShippingStatusEnum.COMPLETED]: {
      borderColor: 'border-green-300',
      bgColor: 'bg-green-100',
      bgTagColor: 'bg-green-300',
      titleColor: 'text-green-600',
      alertVariant: 'bg-green-100 rounded-lg p-3 border',
      buttonBg: '',
      alertTitle: t('order.completed'),
      buttonText: '',
      alertDescription: t('order.statusDescription.completed'),
      nextStatus: ''
    },
    [ShippingStatusEnum.CANCELLED]: {
      borderColor: 'border-red-300',
      bgColor: 'bg-red-100',
      bgTagColor: 'bg-red-200',
      titleColor: 'text-red-600',
      alertVariant: 'bg-red-100 rounded-lg p-3 border',
      buttonBg: '',
      alertTitle: t('order.cancelled'),
      buttonText: '',
      alertDescription: t('order.statusDescription.cancelled'),
      nextStatus: ''
    },
    [ShippingStatusEnum.RETURNING]: {
      borderColor: 'border-indigo-300',
      bgColor: 'bg-indigo-100',
      bgTagColor: 'bg-indigo-300',
      titleColor: 'text-indigo-600',
      alertVariant: 'bg-indigo-100 rounded-lg p-3 border',
      buttonBg: '',
      alertTitle: t('order.returning'),
      buttonText: '',
      alertDescription: t('order.statusDescription.returning'),
      nextStatus: ''
    },
    [ShippingStatusEnum.BRAND_RECEIVED]: {
      borderColor: 'border-emerald-300',
      bgColor: 'bg-emerald-100',
      bgTagColor: 'bg-emerald-300',
      titleColor: 'text-emerald-600',
      alertVariant: 'bg-emerald-100 rounded-lg p-3 border',
      buttonBg: '',
      alertTitle: t('order.brandReceived'),
      buttonText: '',
      alertDescription: t('order.statusDescription.brandReceived', { count: REFUND_WAITING_DAYS }),
      nextStatus: ''
    },
    [ShippingStatusEnum.RETURNED_FAIL]: {
      borderColor: 'border-rose-300',
      bgColor: 'bg-rose-100',
      bgTagColor: 'bg-rose-300',
      titleColor: 'text-rose-600',
      alertVariant: 'bg-rose-100 rounded-lg p-3 border',
      buttonBg: '',
      alertTitle: t('order.returnedFail'),
      buttonText: '',
      alertDescription: t('order.statusDescription.returnFailed'),
      nextStatus: ''
    },
    [ShippingStatusEnum.REFUNDED]: {
      borderColor: 'border-gray-400',
      bgColor: 'bg-gray-200',
      bgTagColor: 'bg-gray-300',
      titleColor: 'text-gray-600',
      alertVariant: 'bg-gray-200 rounded-lg p-3 border',
      buttonBg: '',
      alertTitle: t('order.refunded'),
      buttonText: '',
      alertDescription: t('order.statusDescription.refunded'),
      nextStatus: ''
    }
  }

  const config = statusConfig[order.status]
  if (!config) return null
  return (
    <div className={`${config.alertVariant} ${config.borderColor}`}>
      <div className='flex md:items-center gap-2 md:justify-between md:flex-row flex-col justify-start items-start'>
        <div className='flex items-center gap-2'>
          <Siren className='size-4' />
          <div className='flex flex-col gap-1'>
            {/* <AlertTitle className='flex items-center gap-2'>
            <span
              className={`p-0.5 px-2 rounded-lg border ${config.borderColor} ${config.bgColor} ${config.titleColor}`}
            >
              {config.alertTitle}
            </span>
          </AlertTitle> */}
            <div>
              <span
                className={`px-2 py-1 sm:text-sm text-xs rounded-full uppercase cursor-default font-bold ${config.titleColor} ${config.bgTagColor}`}
              >
                {config.alertTitle}
              </span>
            </div>
            <AlertDescription>{config.alertDescription}</AlertDescription>
          </div>
        </div>
        <div className='flex gap-2 items-center md:m-0 ml-3'>
          {order.status === ShippingStatusEnum.TO_SHIP && (
            <Button
              onClick={() => setIsOpenOrderEvidence(true)}
              loading={isLoading}
              className={`${config.buttonBg} flex gap-2`}
            >
              {config.buttonText}
              <CircleChevronRight />
            </Button>
          )}
          {order.status === ShippingStatusEnum.SHIPPING && (
            <Button
              onClick={() => setIsOpenOrderEvidence(true)}
              loading={isLoading}
              className={`${config.buttonBg} flex gap-2`}
            >
              {config.buttonText}
              <CircleChevronRight />
            </Button>
          )}
          {config.nextStatus &&
            config.nextStatus !== '' &&
            order.status !== ShippingStatusEnum.TO_SHIP &&
            order.status !== ShippingStatusEnum.SHIPPING && (
              <Button
                onClick={() => {
                  handleUpdateStatus({ status: config.nextStatus })
                }}
                loading={isLoading}
                className={`${config.buttonBg} flex gap-2`}
              >
                {config.buttonText}
                <CircleChevronRight />
              </Button>
            )}
          {(order?.status === ShippingStatusEnum.TO_PAY ||
            order?.status === ShippingStatusEnum.WAIT_FOR_CONFIRMATION ||
            (order?.status === ShippingStatusEnum.PREPARING_ORDER && !cancelOrderRequest)) && (
            <div>
              <Button
                variant='outline'
                className='w-full border border-primary text-primary hover:text-primary hover:bg-primary/10'
                onClick={() => {
                  setOpenCancelOrderDialog(true)
                  handleReset()
                }}
              >
                {t('order.cancelOrder')}
              </Button>
            </div>
          )}
          {order?.status === ShippingStatusEnum.RETURNING && !complaintRequest && (
            <div className='flex items-center gap-1'>
              <Button
                variant='default'
                className='w-full bg-emerald-600 hover:bg-emerald-800'
                onClick={() => {
                  handleTakeReceivedAction(ActionReceivedEnum.RECEIVED)
                }}
                loading={isLoading}
              >
                {t('button.received')}
              </Button>
              <Button
                variant='outline'
                className='w-full border border-primary text-primary hover:text-primary hover:bg-primary/10'
                onClick={() => {
                  handleTakeReceivedAction(ActionReceivedEnum.NOT_RECEIVED)
                }}
              >
                {t('button.notReceived')}
              </Button>
              <Button
                className='w-full bg-yellow-500 hover:bg-yellow-600'
                onClick={() => {
                  setIsOpenOrderEvidence(true)
                }}
              >
                {t('button.complaint')}
              </Button>
            </div>
          )}
        </div>
      </div>
      {order.status === ShippingStatusEnum.TO_SHIP ? (
        <UploadOrderEvidenceDialog
          isOpen={isOpenOrderEvidence}
          onClose={() => setIsOpenOrderEvidence(false)}
          order={order}
          dialogTitle={t(`orderEvidence.${ShippingStatusEnum.TO_SHIP}`)}
          dialogDescription={t(`orderEvidence.description.${ShippingStatusEnum.TO_SHIP}`)}
          status={config.nextStatus}
        />
      ) : order.status === ShippingStatusEnum.SHIPPING ? (
        <UploadOrderEvidenceDialog
          isOpen={isOpenOrderEvidence}
          onClose={() => setIsOpenOrderEvidence(false)}
          order={order}
          dialogTitle={t(`orderEvidence.${ShippingStatusEnum.SHIPPING}`)}
          dialogDescription={t(`orderEvidence.description.${ShippingStatusEnum.SHIPPING}`)}
          status={config.nextStatus}
        />
      ) : (
        order.status === ShippingStatusEnum.RETURNING && (
          <ComplaintReturnOrderDialog
            open={isOpenOrderEvidence}
            setOpen={setIsOpenOrderEvidence}
            onOpenChange={setIsOpenOrderEvidence}
            orderId={order.id}
          />
        )
      )}
    </div>
  )
}
