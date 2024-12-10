import { Briefcase, ChevronLeft, FileText, Image, Mail, MapPin, Phone } from 'lucide-react'
import { IconRight } from 'react-day-picker'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import type { Steppers } from '@/hooks/useStepper'
import { brandCreateSchema } from '@/schemas'

import Button from '../button'
import ExpandableDescription from '../ExpandableDescription'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import FileUploadInfo from './FilesUploadInfo'
import InfoItem from './InforItem'

type Props = {
  stepIndex: number
  goNextFn: (number?: number) => void
  goBackfn: (number?: number) => void
  steppers: Steppers[]
  form: UseFormReturn<z.infer<typeof brandCreateSchema>>
}
function Confirmation({ stepIndex, goBackfn, form }: Props) {
  return (
    <div className=''>
      <div className='flex w-full items-center gap-4 '>
        <span className='flex flex-1 items-center justify-center text-center text-xl font-semibold'>
          Step-{stepIndex} <IconRight /> <h1 className='text-center text-2xl font-bold uppercase'> Confirmation</h1>
        </span>
      </div>
      <div className='flex items-center gap-4 text-sm mb-4'>
        <span className='text-3xl text-destructive'>*</span>
        Please review the information before submitting, you can go back to refill the form if there is any mistake.
      </div>

      <Card className='w-full max-w-3xl mx-auto border-primary/60 overflow-hidden'>
        <CardHeader className='bg-primary text-primary-foreground p-6 flex justify-between items-center'>
          <CardTitle className='text-3xl font-bold'>Confirm Your Brand</CardTitle>
        </CardHeader>
        <CardContent className='p-6 space-y-6'>
          <div className='flex items-center justify-between bg-muted p-4 rounded-lg'>
            <div className='flex items-center'>
              <Briefcase className='w-6 h-6 mr-2 text-primary' />
              <h2 className='text-2xl font-semibold line-clamp-1 w-full'>{form.getValues('name') || 'N/A'}</h2>
            </div>
            <Badge
              // variant={data.status === StatusEnum.ACTIVE ? 'secondary' : 'outline'}
              className='text-sm font-medium px-3 py-1'
            >
              {/* {data.status || StatusEnum.PENDING} */}
              {form.getValues('status') || 'PENDING'}
            </Badge>
          </div>
          <Separator className='my-4' />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <InfoItem
              icon={<Mail className='w-5 h-5 text-primary' />}
              label='Email'
              value={form.getValues('email') || 'N/A'}
            />
            <InfoItem
              icon={<Phone className='w-5 h-5 text-primary' />}
              label='Phone'
              value={form.getValues('phone') || 'N/A'}
            />
            <InfoItem
              className='col-span-2'
              icon={<MapPin className='w-5 h-5 text-primary ' />}
              label='Address'
              value={form.getValues('address') || 'N/A'}
            />
          </div>
          <ExpandableDescription description={form.getValues('description') || 'N/A'} />
          <Separator className='my-4' />
          <div className='space-y-4 bg-muted p-4 rounded-lg'>
            <FileUploadInfo
              icon={<Image className='w-5 h-5 text-primary' />}
              label='Logo'
              files={form.getValues('logo')?.length || 0}
            />
            <FileUploadInfo
              icon={<FileText className='w-5 h-5 text-primary' />}
              label='Document'
              files={form.getValues('document')?.length || 0}
            />
          </div>
        </CardContent>
      </Card>
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
          loading={form.formState.isSubmitting}
          // disabled={stepIndex === 3}
          // onClick={() => {
          //   console.log('submitted')
          // }}
        >
          {/* <ChevronRight className=' -mr-1 h-6 w-6 ' /> */}
          Confirm
        </Button>
      </div>
    </div>
  )
}

export default Confirmation
