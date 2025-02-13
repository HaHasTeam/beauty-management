import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { createAddressApi, getMyAddressesApi } from '@/network/apis/address'
import { getUserProfileApi } from '@/network/apis/user'
import CreateAddressSchema from '@/schemas/address.schema'
import { AddressEnum } from '@/types/enum'

import Button from '../button'
import LoadingLayer from '../loading-icon/LoadingLayer'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Form } from '../ui/form'
import { ScrollArea } from '../ui/scroll-area'
import FormAddressContent from './FormAddressContent'

interface AddAddressDialogProps {
  triggerComponent: React.ReactElement<unknown>
}
const AddAddressDialog = ({ triggerComponent }: AddAddressDialogProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const id = useId()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const queryClient = useQueryClient()

  const defaultValues = {
    fullName: '',
    phoneNumber: '',
    detailAddress: '',
    ward: '',
    district: '',
    province: '',
    fullAddress: '',
    type: AddressEnum.HOME
  }

  const form = useForm<z.infer<typeof CreateAddressSchema>>({
    resolver: zodResolver(CreateAddressSchema),
    defaultValues
  })
  const handleReset = () => {
    form.reset()
    setOpen(false)
  }
  const { data: useProfileData } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn
  })
  const { mutateAsync: createAddressFn } = useMutation({
    mutationKey: [createAddressApi.mutationKey],
    mutationFn: createAddressApi.fn,
    onSuccess: () => {
      successToast({
        message: `${t('address.addSuccess')}`
      })
      queryClient.invalidateQueries({
        queryKey: [getMyAddressesApi.queryKey]
      })
      handleReset()
    }
  })
  async function onSubmit(values: z.infer<typeof CreateAddressSchema>) {
    try {
      setIsLoading(true)
      if (useProfileData && useProfileData?.data) {
        const transformedValues = {
          ...values,
          account: useProfileData?.data?.id,
          fullAddress: `${values.detailAddress}, ${values.ward}, ${values.district}, ${values.province}`
        }

        await createAddressFn(transformedValues)
      }

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleServerError({
        error,
        form
      })
    }
  }
  return (
    <div>
      {isLoading && <LoadingLayer />}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
        <DialogContent className='max-w-md sm:max-w-xl lg:max-w-3xl'>
          <DialogHeader>
            <div className='flex justify-between items-center'>
              <DialogTitle>{t('address.addNewAddress')}</DialogTitle>
            </div>
          </DialogHeader>
          <Form {...form}>
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className='w-full' id={`form-${id}`}>
              <div>
                {/* Form Address */}
                <ScrollArea className='h-72 pr-2'>
                  <FormAddressContent form={form} />
                </ScrollArea>
              </div>
              <DialogFooter>
                <div className='flex justify-end gap-2 w-full'>
                  <Button type='button' variant='outline' onClick={() => setOpen(false)}>
                    {t('dialog.cancel')}
                  </Button>
                  <Button form={`form-${id}`} type='submit' loading={isLoading}>
                    {t('dialog.ok')}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddAddressDialog
