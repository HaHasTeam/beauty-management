import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { IconRight } from 'react-day-picker'
import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import FormLabel from '@/components/form-label'
import { templateFileUrl } from '@/constants/infor'
import type { Steppers } from '@/hooks/useStepper'
import { brandCreateSchema } from '@/schemas'

import AddAddressBrandDialog from '../address/AddAddressBrandDialog'
import Button from '../button'
import UploadFilePreview from '../file-input/UploadFilePreview'
import { PhoneInputWithCountries } from '../phone-input'
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

type Props = {
  stepIndex: number
  goNextFn: (number?: number) => void
  goBackfn: (number?: number) => void
  steppers: Steppers[]
  form: UseFormReturn<z.infer<typeof brandCreateSchema>>
}
function BranchDetails({ stepIndex, goBackfn, goNextFn, form }: Props) {
  const { t } = useTranslation()
  const [addressText, setAddressText] = useState('')
  const handleAdress = async ({
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
  }) => {
    form.setValue('address', fullAddress)
    form.setValue('district', district)
    form.setValue('ward', ward)
    form.setValue('province', province)

    setAddressText(fullAddress)
  }

  const addressDisplay = useMemo(() => {
    return addressText !== '' ? (
      <Button className='text-primary border-primary hover:text-primary hover:bg-primary/15' variant='outline'>
        {addressText}
      </Button>
    ) : (
      <Button className='text-primary border-primary hover:text-primary hover:bg-primary/15' variant='outline'>
        <PlusCircle /> {t('address.addNewAddress')}
      </Button>
    )
  }, [addressText, t])
  return (
    <div className=''>
      <div className='flex w-full items-center gap-4 mb-10'>
        <span className='flex flex-1 items-center justify-center text-center text-xl font-semibold'>
          {t('branchDetails.step', { stepIndex })}
          <IconRight className='mr-1' />{' '}
          <h1 className='text-center text-2xl font-bold uppercase'>{t('branchDetails.generalInformation')}</h1>
        </span>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='grid gap-4 grid-cols-2'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t('branchDetails.name.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('branchDetails.name.placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t('branchDetails.email.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('branchDetails.email.placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='space-y-2'>
          <FormLabel required>{t('branchDetails.address.label')}</FormLabel>
          <AddAddressBrandDialog parentForm={form} getAddress={handleAdress} triggerComponent={addressDisplay} />
        </div>

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('branchDetails.description.label')}</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder={t('branchDetails.description.placeholder')}
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('branchDetails.phone.label')}</FormLabel>
              <FormControl>
                <PhoneInputWithCountries {...field} isShowCountry={true} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='document'
          render={({ field }) => (
            <FormItem>
              <FormLabel required>{t('branchDetails.document.label')}</FormLabel>
              <UploadFilePreview
                vertical
                field={field}
                dropZoneConfigOptions={{ maxFiles: 10 }}
                header={
                  <div>
                    <div className='text-muted-foreground'>{t('branchDetails.document.uploadDescription')}</div>
                    <a href={templateFileUrl} download className='text-primary underline'>
                      {t('branchDetails.document.downloadTemplate')}
                    </a>
                  </div>
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className='mt-10 w-full flex justify-between items-center'>
        <Button
          className='flex select-none items-center justify-center gap-2 px-4'
          disabled={stepIndex === 0}
          variant={'outline'}
          onClick={() => {
            goBackfn()
          }}
        >
          <ChevronLeft />
          {t('branchDetails.navigation.back')}
        </Button>
        <Button
          type='button'
          className='flex select-none items-center justify-center gap-2 px-4'
          disabled={stepIndex === 0}
          onClick={async () => {
            const value = await form.trigger()
            if (value) {
              goNextFn()
            }
          }}
        >
          {t('branchDetails.navigation.next')}
          <ChevronRight className='-mr-1 h-6 w-6' />
        </Button>
      </div>
    </div>
  )
}

export default BranchDetails
