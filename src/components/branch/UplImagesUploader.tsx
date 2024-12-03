import { ChevronLeft, ChevronRight } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { FaCameraRotate } from 'react-icons/fa6'
import { MdPhoto } from 'react-icons/md'
import { z } from 'zod'

import type { Steppers } from '@/hooks/useStepper'
import { brandCreateSchema } from '@/schemas'

import Button from '../button'
import UploadFilePreview from '../file-input/UploadFilePreview'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Card } from '../ui/card'
import { FormField, FormItem } from '../ui/form'

type Props = {
  stepIndex: number
  goNextFn: (number?: number) => void
  goBackfn: (number?: number) => void
  steppers: Steppers[]
  form: UseFormReturn<z.infer<typeof brandCreateSchema>>
}
function UplImagesUploader({ stepIndex, goBackfn, goNextFn, steppers, form }: Props) {
  return (
    <div className=''>
      <FormField
        control={form.control}
        name='logo'
        render={({ field }) => (
          <FormItem>
            <UploadFilePreview
              field={field}
              Trigger={
                <FaCameraRotate
                  size={20}
                  className='cursor-pointer absolute bottom-3 right-3 hover:scale-150 transition-all shadow-lg duration-500 text-foreground p-0.5 rounded-full bg-primary/80'
                />
              }
            />
          </FormItem>
        )}
      />

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
          type='submit'
          // disabled={stepIndex === 0}
          // onClick={() => {
          //   // goNextFn()
          //   console.log('clicked', form.getValues())
          // }}
        >
          <ChevronRight className=' -mr-1 h-6 w-6 ' />
          Next
        </Button>
      </div>
    </div>
  )
}

export default UplImagesUploader
