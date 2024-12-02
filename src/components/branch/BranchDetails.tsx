import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { IconRight } from 'react-day-picker'
import type { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import FormLabel from '@/components/form-label'
import type { Steppers } from '@/hooks/useStepper'
import { brandCreateSchema } from '@/schemas'

import { AddressPopup } from '../address-popup'
import Button from '../button'
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'

type Props = {
  stepIndex: number
  goNextFn: (number?: number) => void
  goBackfn: (number?: number) => void
  steppers: Steppers[]
  form: UseFormReturn<z.infer<typeof brandCreateSchema>>
}
function BranchDetails({ stepIndex, goBackfn, goNextFn, form }: Props) {
  const [addresses, setAddresses] = useState<string[]>([])
  const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false)

  const handleAddAddress = (newAddress: string) => {
    setAddresses([...addresses, newAddress])
  }
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
                    className='min-h-[50px] px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                    placeholder='
                please enter your brand name
                    '
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
                <FormLabel required>Email</FormLabel>
                <FormControl>
                  <Input
                    className='min-h-[50px] px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                    placeholder='
                     e.g. allure@gmail.com
                    '
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Address</FormLabel>
              <FormControl>
                <Input
                  className='min-h-[50px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                  placeholder='Address'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Description</FormLabel>
              <FormControl>
                <Input
                  className='min-h-[50px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                  placeholder='
                 description
                    '
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
              <FormLabel required>Phone</FormLabel>
              <FormControl>
                <Input
                  className='min-h-[50px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                  placeholder='Phone'
                  {...field}
                />
              </FormControl>
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
          className=' flex select-none items-center justify-center gap-2 px-4'
          disabled={stepIndex === 0}
          onClick={() => {
            goNextFn()
          }}
        >
          <ChevronRight className=' -mr-1 h-6 w-6 ' />
          Next
        </Button>
      </div>
      <AddressPopup
        isOpen={isAddressPopupOpen}
        onClose={() => setIsAddressPopupOpen(false)}
        onSave={handleAddAddress}
      />
    </div>
  )
}

export default BranchDetails
