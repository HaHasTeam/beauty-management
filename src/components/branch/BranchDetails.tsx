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
          Step-{stepIndex}
          <IconRight className='mr-1' />{' '}
          <h1 className='text-center text-2xl font-bold uppercase'>General Information</h1>
        </span>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='grid gap-4 grid-cols-2'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Name</FormLabel>
                <FormControl>
                  <Input
                    // className='min-h-[50px] px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                    placeholder='please enter your brand name'
                    {...field}
                  />
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
                <FormLabel required>Email Brand</FormLabel>
                <FormControl>
                  <Input
                    // className='min-h-[50px] px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                    placeholder='e.g. allure@gmail.com'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='space-y-2'>
          <FormLabel required>Address</FormLabel>
          <AddAddressBrandDialog parentForm={form} getAddress={handleAdress} triggerComponent={addressDisplay} />
        </div>

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder='description' className='resize-none' {...field} />
                {/* <Input
                        className='min-h-[50px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                        placeholder='
                 description
                    '
                        {...field}
                      /> */}
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
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <PhoneInputWithCountries {...field} isShowCountry={true} />
                {/* <Input
                  // className='min-h-[50px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                  placeholder='Phone'
                  {...field}
                /> */}
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
              <FormLabel required>Document</FormLabel>
              <UploadFilePreview
                vertical
                field={field}
                dropZoneConfigOptions={{ maxFiles: 10 }}
                header={
                  <div>
                    {/* <div className='text-2xl font-bold text-foreground'>Upload Your File(s)</div> */}
                    <div className='text-muted-foreground'>
                      You must upload at least 1 document for your lisense details. To help you, we've provided a
                      template file. Please download it, fill in the necessary details, and upload it back:
                    </div>
                    <a href={templateFileUrl} download className='text-primary underline'>
                      Download License Details Template
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
          Back
        </Button>
        <Button
          type='button'
          className=' flex select-none items-center justify-center gap-2 px-4'
          disabled={stepIndex === 0}
          onClick={async () => {
            const value = await form.trigger()
            if (value) {
              goNextFn()
            }
          }}
        >
          <ChevronRight className=' -mr-1 h-6 w-6 ' />
          Next
        </Button>
      </div>
    </div>
  )
}

export default BranchDetails
