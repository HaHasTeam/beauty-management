import { zodResolver } from '@hookform/resolvers/zod'
import { BadgePlus, Images, Info } from 'lucide-react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import MockImage from '@/assets/SidebarBadge.png'
import BranchCreation from '@/components/branch/BranchCreation'
import BranchDetails from '@/components/branch/BranchDetails'
import Confirmation from '@/components/branch/Confirmation'
// import DocumentDetails from '@/components/branch/DocumentDetails'
import UplImagesUploader from '@/components/branch/UplImagesUploader'
import Stepper from '@/components/steppers'
import { Form } from '@/components/ui/form'
import type { Steppers } from '@/hooks/useStepper'
import useStepper from '@/hooks/useStepper'
import { useToast } from '@/hooks/useToast'
import { brandCreateSchema } from '@/schemas'

function Home() {
  const { errorToast } = useToast()

  const form = useForm<z.infer<typeof brandCreateSchema>>({
    resolver: zodResolver(brandCreateSchema),
    defaultValues: {
      email: '',
      phone: '',
      address: '',
      description: '',
      document: '',
      logo: [],
      name: ''
    }
  })
  const steppers: Steppers[] = [
    {
      icon: <BadgePlus />,
      label: 'Branch Creation',
      key: 'branch-creation'
    },

    {
      icon: <Info />,
      label: 'Branch details',
      key: 'branch-details'
    },
    {
      icon: <Images />,
      label: 'Images',
      key: 'images'
    }
    // {
    //   icon: <ContactRoundIcon />,
    //   label: 'Lisense details',
    //   key: 'lisense-details'
    // }
  ]
  const { activeStep, goBack, goNext } = useStepper({ steppers })
  const Silde = useMemo(() => {
    switch (steppers[activeStep]?.key) {
      case 'branch-creation':
        return <BranchCreation stepIndex={activeStep} goNextFn={goNext} goBackfn={goBack} steppers={steppers} />
      case 'branch-details':
        return (
          <BranchDetails stepIndex={activeStep} goNextFn={goNext} goBackfn={goBack} steppers={steppers} form={form} />
        )
      case 'images':
        return (
          <UplImagesUploader
            stepIndex={activeStep}
            goNextFn={goNext}
            goBackfn={goBack}
            steppers={steppers}
            form={form}
          />
        )
      // case 'lisense-details':
      //   return <DocumentDetails stepIndex={activeStep} goNextFn={goNext} goBackfn={goBack} steppers={steppers} />
      default:
        return <Confirmation stepIndex={activeStep} goNextFn={goNext} goBackfn={goBack} steppers={steppers} />
    }
  }, [activeStep])

  function onSubmit(values: z.infer<typeof brandCreateSchema>) {
    try {
      console.log('valuse 86: ', values)
    } catch (error) {
      console.error('Form submission error', error)
      errorToast({
        message: 'Failed to submit the form. Please try again.'
      })
    }
  }
  return (
    <div className='min-h-screen bg-primary/10'>
      <header className='border-b bg-secondary px-4 py-3 shadow-md'>
        <div className='flex items-center gap-2'>
          <img src={MockImage} alt='Shopee Logo' width={32} height={32} className='h-8 w-8' />
          <span className='text-lg'>Đăng ký trở thành Người bán hàng</span>
        </div>
      </header>

      <main className='m-auto max-w-3xl px-4 py-8 mt-10 bg-white rounded-lg backdrop-blur-3xl'>
        <Stepper steppers={steppers} activeStep={activeStep} />

        <div className='p-6'>
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
              className='w-full grid gap-4 mb-8'
              id={`form-create-branch`}
            >
              {Silde}
            </form>
          </Form>
        </div>
      </main>
    </div>
  )
}

export default Home
