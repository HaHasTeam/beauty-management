import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useId, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import useHandleServerError from '@/hooks/useHandleServerError'
import { getCommuneMutation, getDistrictMutation, getProvinceMutation } from '@/network/apis/address'
import { brandCreateSchema, CreateAddressBrandSchema } from '@/schemas'
import { parseAddress } from '@/utils/string'

import Button from '../button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Form } from '../ui/form'
import { ScrollArea } from '../ui/scroll-area'
import FormAddressContent from './FormAddressContent'

interface AddAddressDialogProps {
  parentForm: UseFormReturn<z.infer<typeof brandCreateSchema>>

  triggerComponent: React.ReactElement<unknown>
  getAddress: ({
    detailAddress,
    ward,
    district,
    province,
    fullAddress
  }: {
    detailAddress: string
    ward: string
    district: string
    province: string
    fullAddress: string
  }) => Promise<void>
}
const AddAddressDialog = ({ triggerComponent, getAddress, parentForm }: AddAddressDialogProps) => {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const id = useId()

  const handleServerError = useHandleServerError()
  const address = parentForm?.watch('address')

  const { detailAddress, ward, district, province, fullAddress } = parseAddress(address || '')
  const defaultValues = {
    detailAddress: detailAddress || '',
    ward: ward || '',
    district: district || '',
    province: province || '',
    fullAddress: fullAddress || ''
  }
  const { mutateAsync: getProvinceMutate } = useMutation({
    mutationKey: [getProvinceMutation.mutationKey],
    mutationFn: getProvinceMutation.fn
  })

  const { mutateAsync: getDistrictMutate } = useMutation({
    mutationKey: [getDistrictMutation.mutationKey],
    mutationFn: getDistrictMutation.fn
  })

  const { mutateAsync: getCommuneMutate } = useMutation({
    mutationKey: [getCommuneMutation.mutationKey],
    mutationFn: getCommuneMutation.fn
  })
  const form = useForm<z.infer<typeof CreateAddressBrandSchema>>({
    resolver: zodResolver(CreateAddressBrandSchema),
    values: defaultValues
  })

  const handleReset = () => {
    form.reset()
    setOpen(false)
  }

  async function onSubmit(values: z.infer<typeof CreateAddressBrandSchema>) {
    try {
      const provinceSelected = await getProvinceMutate(values.province)
      const districtSelected = await getDistrictMutate({ idDistrict: values.district, idProvince: values.province })
      const communeSelected = await getCommuneMutate({
        idCommune: values.ward,
        idDistrict: values.district,
        idProvince: values.province
      })

      const transformedValues = {
        ...values,

        fullAddress: `${values.detailAddress}, ${communeSelected.data[0].name}, ${districtSelected.data[0].name}, ${provinceSelected.data[0].name}`
      }

      await getAddress({ ...transformedValues })
      handleReset()
    } catch (error) {
      handleServerError({
        error,
        form
      })
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
        <DialogContent className='max-w-md sm:max-w-xl lg:max-w-3xl'>
          <DialogHeader>
            <div className='flex justify-between items-center'>
              <DialogTitle>{t('address.addNewAddress')}</DialogTitle>
            </div>
          </DialogHeader>
          <Form {...form}>
            <form noValidate className='w-full' id={`form-${id}`}>
              <div>
                {/* Form Address */}
                <ScrollArea className='h-72'>
                  <FormAddressContent
                    form={form}
                    // communeData={communeData}
                    // districtData={districtData}
                    // provinceData={provinceData}
                  />
                </ScrollArea>
              </div>
              <DialogFooter>
                <div className='flex justify-end gap-2 w-full'>
                  <Button type='button' variant='outline' onClick={() => setOpen(false)}>
                    {t('dialog.cancel')}
                  </Button>
                  <Button form={`form-${id}`} type='button' onClick={form.handleSubmit(onSubmit)}>
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
