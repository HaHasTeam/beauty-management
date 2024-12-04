import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IconRight } from 'react-day-picker'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import FormLabel from '@/components/form-label'
import type { Steppers } from '@/hooks/useStepper'
import { brandCreateSchema } from '@/schemas'

import Button from '../button'
import UploadFilePreview from '../file-input/UploadFilePreview'
import { FormField, FormItem } from '../ui/form'

type Props = {
  stepIndex: number
  goNextFn: (number?: number) => void
  goBackfn: (number?: number) => void
  steppers: Steppers[]
  form: UseFormReturn<z.infer<typeof brandCreateSchema>>
}
function UplImagesUploader({ stepIndex, goBackfn, goNextFn, form }: Props) {
  return (
    <div className=''>
      <div className='flex w-full items-center gap-4'>
        <span className='flex flex-1 items-center justify-center text-center text-xl font-semibold'>
          Step-{stepIndex}
          <IconRight /> <h1 className='text-center text-2xl font-bold uppercase'>Images Uploader</h1>
        </span>
      </div>
      <div className='flex flex-col gap-4'>
        <FormField
          control={form.control}
          name='logo'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <UploadFilePreview
                field={field}
                dropZoneConfigOptions={{ maxFiles: 1 }}
                header={
                  <div>
                    {/* <div className='text-2xl font-bold text-foreground'>Upload Your File(s)</div> */}
                    <div className='text-muted-foreground'>Please choose your logo</div>
                  </div>
                }
              />
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
          type='submit'
          // disabled={!form.formState.isValid}
          onClick={() => {
            goNextFn()
          }}
        >
          <ChevronRight className=' -mr-1 h-6 w-6 ' />
          Next
        </Button>
      </div>
    </div>
  )
}

export default UplImagesUploader
