import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useId, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import useHandleServerError from '@/hooks/useHandleServerError'
import { getCommuneMutation, getDistrictMutation, getProvinceMutation } from '@/network/apis/address'
import { brandCreateSchema, CreateAddressBrandSchema } from '@/schemas'
import { convertToSlug } from '@/utils'
import { parseAddress } from '@/utils/string'

import Button from '../button'
import LoadingLayer from '../loading-icon/LoadingLayer'
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
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState({
    ward: '',
    district: '',
    province: ''
  })
  const handleServerError = useHandleServerError()
  const address = parentForm?.watch('address')
  const ward = parentForm?.watch('ward')
  const district = parentForm?.watch('district')
  const province = parentForm?.watch('province')

  const { detailAddress, fullAddress } = parseAddress(address || '')

  const defaultValues = {
    detailAddress: detailAddress || '',
    ward: location.ward || '',
    district: location.district || '',
    province: location.province || '',
    fullAddress: fullAddress || ''
  }

  const { mutateAsync: getProvinceMutate, isPending: isProvinceMutatePending } = useMutation({
    mutationKey: [getProvinceMutation.mutationKey],
    mutationFn: getProvinceMutation.fn
  })

  const { mutateAsync: getDistrictMutate, isPending: isDistrictMutatePending } = useMutation({
    mutationKey: [getDistrictMutation.mutationKey],
    mutationFn: getDistrictMutation.fn
  })

  const { mutateAsync: getCommuneMutate, isPending: isCommuneMutatePending } = useMutation({
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
        ward: communeSelected.data[0].name,
        province: provinceSelected.data[0].name,
        district: districtSelected.data[0].name,
        detailAddress: values.detailAddress,
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

  useEffect(() => {
    if (!address) return

    const fetchAddress = async () => {
      try {
        setLoading(true)

        const provinceRes = await getProvinceMutate('')
        const findProvince = provinceRes.data.find((el) => convertToSlug(el.name) === convertToSlug(province))

        if (!findProvince) return
        setLocation((prev) => ({ ...prev, province: findProvince.idProvince }))

        const districtRes = await getDistrictMutate({ idProvince: findProvince.idProvince })
        const findDistrict = districtRes.data.find((el) => convertToSlug(el.name) === convertToSlug(district))

        if (!findDistrict) return
        setLocation((prev) => ({ ...prev, district: findDistrict.idDistrict }))

        const communeRes = await getCommuneMutate({
          idProvince: findProvince.idProvince,
          idDistrict: findDistrict.idDistrict
        })
        const findWard = communeRes.data.find((el) => convertToSlug(el.name) === convertToSlug(ward))

        if (!findWard) return
        setLocation((prev) => ({ ...prev, ward: findWard.idCommune }))
      } catch (error) {
        console.error('Error fetching address data in dialog:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAddress()
  }, [address, district, getCommuneMutate, getDistrictMutate, getProvinceMutate, province, ward])

  return (
    <>
      {loading && <LoadingLayer />}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
        <DialogContent className='max-w-md sm:max-w-xl lg:max-w-3xl' aria-describedby='address-content'>
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
                  <FormAddressContent form={form} />
                </ScrollArea>
              </div>
              <DialogFooter>
                <div className='flex justify-end gap-2 w-full'>
                  <Button type='button' variant='outline' onClick={() => setOpen(false)}>
                    {t('dialog.cancel')}
                  </Button>
                  <Button
                    form={`form-${id}`}
                    type='button'
                    onClick={form.handleSubmit(onSubmit)}
                    loading={isProvinceMutatePending || isDistrictMutatePending || isCommuneMutatePending}
                  >
                    {t('dialog.ok')}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddAddressDialog
