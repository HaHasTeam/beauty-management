import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CircleChevronRight, Siren } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import useGrant from '@/hooks/useGrant'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import {
  getAllSystemServiceApi,
  getSystemServiceByIdApi,
  updateSystemServiceStatusApi
} from '@/network/apis/system-service'
import { getUpdateSystemServiceStatusSchema } from '@/schemas/system-service.schema'
import { RoleEnum, StatusEnum } from '@/types/enum'
import { IResponseSystemService } from '@/types/system-service'

import Button from '../button'
import { AlertDescription } from '../ui/alert'

interface UpdateSystemServiceStatusProps {
  systemService: IResponseSystemService
}

export default function UpdateSystemServiceStatus({ systemService }: UpdateSystemServiceStatusProps) {
  const { t } = useTranslation()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const UpdateSystemServiceStatusSchema = getUpdateSystemServiceStatusSchema()

  const defaultProductValues = {
    status: ''
  }
  const handleReset = () => {
    form.reset()
  }

  const isGrant = useGrant([RoleEnum.ADMIN, RoleEnum.OPERATOR])
  const form = useForm<z.infer<typeof UpdateSystemServiceStatusSchema>>({
    resolver: zodResolver(UpdateSystemServiceStatusSchema),
    defaultValues: defaultProductValues
  })
  const { mutateAsync: updateSystemServiceStatusFn } = useMutation({
    mutationKey: [updateSystemServiceStatusApi.mutationKey],
    mutationFn: updateSystemServiceStatusApi.fn,
    onSuccess: async () => {
      successToast({
        message: t('systemService.updateSystemServiceStatusSuccess')
      })
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [getSystemServiceByIdApi.queryKey] }),
        queryClient.invalidateQueries({ queryKey: [getAllSystemServiceApi.queryKey] })
      ])
      handleReset()
    }
  })
  async function handleUpdateStatus(values: z.infer<typeof UpdateSystemServiceStatusSchema>) {
    try {
      setIsLoading(true)
      await updateSystemServiceStatusFn({ id: systemService?.id ?? '', status: values.status })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleServerError({
        error,
        form
      })
    }
  }

  if (!systemService) return null
  const statusConfig = {
    [StatusEnum.ACTIVE]: {
      borderColor: 'border-green-300',
      bgColor: 'bg-green-100',
      bgTagColor: 'bg-green-300',
      titleColor: 'text-green-600',
      alertVariant: 'bg-green-100 rounded-lg p-3 border',
      buttonBg: 'bg-gray-500 hover:bg-gray-400',
      alertTitle: t(`status.${StatusEnum.ACTIVE}`),
      buttonText: t(`status.button_${StatusEnum.INACTIVE}`),
      alertDescription: t(`systemService.statusDescription.${StatusEnum.ACTIVE}`),
      nextStatus: StatusEnum.INACTIVE
    },

    [StatusEnum.INACTIVE]: {
      borderColor: 'border-gray-400',
      bgColor: 'bg-gray-200',
      bgTagColor: 'bg-gray-300',
      titleColor: 'text-gray-600',
      alertVariant: 'bg-gray-200 rounded-lg p-3 border',
      buttonBg: 'bg-green-500 hover:bg-green-400',
      alertTitle: t(`status.${StatusEnum.INACTIVE}`),
      buttonText: t(`status.button_${StatusEnum.ACTIVE}`),
      alertDescription: t(`systemService.statusDescription.${StatusEnum.INACTIVE}`),
      nextStatus: StatusEnum.ACTIVE
    }
  }

  const config = statusConfig[systemService.status]
  if (!config) return null
  return (
    <div className={`${config.alertVariant} ${config.borderColor}`}>
      <div className='flex md:items-center gap-2 md:justify-between md:flex-row flex-col justify-start items-start'>
        <div className='flex items-center gap-2'>
          <div className='flex gap-2 items-center'>
            <div className='p-2 bg-white/80 rounded-full'>
              <Siren className={`${config.titleColor} size-6`} />
            </div>
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
        </div>
        {isGrant ? (
          <div className='flex gap-2 items-center md:m-0 ml-3'>
            {config.nextStatus && (
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
          </div>
        ) : null}
      </div>
    </div>
  )
}
