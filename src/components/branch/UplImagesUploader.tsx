import { ChevronLeft, ChevronRight } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { FaCameraRotate } from 'react-icons/fa6'
import { MdPhoto } from 'react-icons/md'

import type { Steppers } from '@/hooks/useStepper'
import { brandCreateSchema } from '@/schemas'

import Button from '../button'
import UploadFileModal from '../file-input/UploadFileModal'
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
            <Card className={'h-min flex items-center align-center max-w-full py-8 px-4 dark:border-zinc-800'}>
              <div className='flex gap-4 items-center justify-between w-full flex-wrap'>
                <div className='flex gap-4 items-center'>
                  <Avatar className='min-h-[68px] min-w-[68px] relative'>
                    <AvatarImage src={form.watch('logo') || ''} />
                    <AvatarFallback className='text-2xl font-bold dark:bg-accent/20'>A</AvatarFallback>
                    <UploadFileModal
                      field={field}
                      Trigger={
                        <FaCameraRotate
                          size={20}
                          className='cursor-pointer absolute bottom-3 right-3 hover:scale-150 transition-all shadow-lg duration-500 text-foreground p-0.5 rounded-full bg-primary/80'
                        />
                      }
                    />
                  </Avatar>
                  <div>
                    <p className='text-xl font-extrabold  leading-[100%]  pl-4 md:text-3xl'>Allure Beauty</p>
                    <p className='text-sm font-medium  md:mt-2 pl-4 md:text-base'>CEO and Founder</p>
                  </div>
                </div>
                <Button loading={form.formState.isSubmitting}>
                  <MdPhoto className='flex items-center gap-2' />
                  Save Avatar
                </Button>
              </div>
            </Card>
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
          disabled={stepIndex === 0}
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
