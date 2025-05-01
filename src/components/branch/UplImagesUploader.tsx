import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IconRight } from 'react-day-picker'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import FormLabel from '@/components/form-label'
import type { Steppers } from '@/hooks/useStepper'
import { brandCreateSchema } from '@/schemas'

import Button from '../button'
import UploadFilePreview from '../file-input/UploadFilePreview'
import { FlexDatePicker } from '../flexible-date-picker/FlexDatePicker'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'

type Props = {
  stepIndex: number
  goNextFn: (number?: number) => void
  goBackfn: (number?: number) => void
  steppers: Steppers[]
  form: UseFormReturn<z.infer<typeof brandCreateSchema>>
}
function UplImagesUploader({ stepIndex, goBackfn, goNextFn, form }: Props) {
  const { t } = useTranslation()

  return (
    <div className=''>
      <div className='flex w-full items-center gap-4'>
        <span className='flex flex-1 items-center justify-center text-center text-xl font-semibold'>
          {t('imagesUploader.step', { stepIndex })}
          <IconRight /> <h1 className='text-center text-2xl font-bold uppercase'>{t('imagesUploader.title')}</h1>
        </span>
      </div>
      {/* content start */}
      <div className='grid grid-cols-1 gap-4'>
        <div className='grid grid-cols-2'>
          <FormField
            control={form.control}
            name='logo'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('imagesUploader.logo.label')}</FormLabel>
                <UploadFilePreview
                  field={field}
                  vertical
                  dropZoneConfigOptions={{ maxFiles: 1 }}
                  header={
                    <div>
                      <div className='text-muted-foreground'>{t('imagesUploader.logo.description')}</div>
                    </div>
                  }
                />
              </FormItem>
            )}
          />
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='businessTaxCode'
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t('imagesUploader.businessTaxCode.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('imagesUploader.businessTaxCode.placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='establishmentDate'
            render={({ field, formState }) => {
              return (
                <FormItem className='flex flex-col space-y-0'>
                  <FormLabel required>{t('imagesUploader.establishmentDate.label')}</FormLabel>
                  <FlexDatePicker
                    onlyPastDates
                    field={field}
                    formState={{
                      ...formState,
                      ...form
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='businessRegistrationCode'
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t('imagesUploader.businessRegistrationCode.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('imagesUploader.businessRegistrationCode.placeholder')} {...field} />
                </FormControl>
                <FormDescription>{t('imagesUploader.businessRegistrationCode.description')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='businessRegistrationAddress'
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t('imagesUploader.businessRegistrationAddress.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('imagesUploader.businessRegistrationAddress.placeholder')} {...field} />
                </FormControl>
                <FormDescription>{t('imagesUploader.businessRegistrationAddress.description')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      {/* end content  */}

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
          {t('imagesUploader.navigation.back')}
        </Button>
        <Button
          className='flex select-none items-center justify-center gap-2 px-4'
          type='submit'
          onClick={() => {
            goNextFn()
          }}
        >
          {t('imagesUploader.navigation.next')}
          <ChevronRight className='-mr-1 h-6 w-6' />
        </Button>
      </div>
    </div>
  )
}

export default UplImagesUploader
