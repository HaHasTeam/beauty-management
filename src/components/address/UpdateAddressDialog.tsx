import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getAddressByIdApi, getMyAddressesApi, updateAddressApi } from '@/network/apis/address'
import CreateAddressSchema from '@/schemas/address.schema'
import { IAddress } from '@/types/address'
import { AddressEnum } from '@/types/enum'

import Button from '../button'
import LoadingLayer from '../loading-icon/LoadingLayer'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Form } from '../ui/form'
import { ScrollArea } from '../ui/scroll-area'
import FormAddressContent from './FormAddressContent'

interface UpdateAddressDialogProps {
  triggerComponent: React.ReactElement<unknown>
  address: IAddress
}
const UpdateAddressDialog = ({ address, triggerComponent }: UpdateAddressDialogProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const id = useId()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const queryClient = useQueryClient()

  const defaultValues = {
    fullName: address?.fullName ?? '',
    phoneNumber: address?.phone ?? '',
    detailAddress: address?.detailAddress ?? '',
    ward: address?.ward ?? '',
    district: address?.district ?? '',
    province: address?.province ?? '',
    fullAddress: address?.fullAddress ?? '',
    type: address?.type ?? AddressEnum?.HOME,
    notes: address?.notes ?? '',
    isDefault: address?.isDefault ?? false,
  }
  console.log(defaultValues)

  const form = useForm<z.infer<typeof CreateAddressSchema>>({
    resolver: zodResolver(CreateAddressSchema),
    defaultValues,
  })
  const handleReset = () => {
    form.reset()
    setOpen(false)
  }
  const { mutateAsync: updateAddressFn } = useMutation({
    mutationKey: [updateAddressApi.mutationKey],
    mutationFn: updateAddressApi.fn,
    onSuccess: () => {
      successToast({
        message: `${t('address.updateSuccess')}`,
      })
      queryClient.invalidateQueries({
        queryKey: [getAddressByIdApi.queryKey, address?.id as string],
      })
      queryClient.invalidateQueries({
        queryKey: [getMyAddressesApi.queryKey],
      })
      handleReset()
    },
  })
  async function onSubmit(values: z.infer<typeof CreateAddressSchema>) {
    try {
      setIsLoading(true)
      const transformedValues = {
        ...values,
        id: address?.id ?? '',
        fullAddress: `${values.detailAddress}, ${values.ward}, ${values.district}, ${values.province}`,
      }

      console.log(transformedValues)
      await updateAddressFn(transformedValues)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleServerError({
        error,
        form,
      })
    }
  }
  return (
    <div>
      {isLoading && <LoadingLayer />}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
        <DialogContent className="max-w-md sm:max-w-xl lg:max-w-3xl">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>{t('address.updateAddress')}</DialogTitle>
            </div>
          </DialogHeader>
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e, form.getValues()))}
              className="w-full"
              id={`form-${id}`}
            >
              <div>
                {/* Form Address */}
                <ScrollArea className="h-72">
                  <FormAddressContent form={form} initialAddress={defaultValues} />
                </ScrollArea>
              </div>
              <DialogFooter>
                <div className="flex justify-end gap-2 w-full">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    {t('dialog.cancel')}
                  </Button>
                  <Button type="submit" loading={isLoading}>
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

export default UpdateAddressDialog
