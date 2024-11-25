import { defineStepper } from '@stepperize/react'

import MockImage from '@/assets/SidebarBadge.png'
import Steppers from '@/components/steppers'

function Home() {
  const { useStepper, steps } = defineStepper(
    { id: 'step-1', title: 'Step 1', description: 'Description for step 1' },
    { id: 'step-2', title: 'Step 2', description: 'Description for step 2' },
    { id: 'step-3', title: 'Step 3', description: 'Description for step 3' },
    { id: 'step-4', title: 'Step 4', description: 'Description for step 4' }
  )
  const stepper = useStepper()
  return (
    <div className='min-h-screen bg-primary/10'>
      <header className='border-b bg-secondary px-4 py-3 shadow-md'>
        <div className='flex items-center gap-2'>
          <img src={MockImage} alt='Shopee Logo' width={32} height={32} className='h-8 w-8' />
          <span className='text-lg'>Đăng ký trở thành Người bán hàng</span>
        </div>
      </header>

      <main className='mx-auto max-w-3xl px-4 py-8'>
        <div className='mb-8 flex justify-between'>
          {/* {steps.map((step, index) => (
            <div key={step.id} className='flex flex-1 items-center'>
              <div className='flex flex-col items-center'>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    step.id === stepper.current.id ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`mt-2 text-sm ${step.id === stepper.current.id ? 'text-orange-500' : 'text-gray-500'}`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-[2px] flex-1 ${step.id < stepper.current.id ? 'bg-orange-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))} */}
          <Steppers steps={steps} stepperHook={stepper} />
        </div>

        <div className='rounded-lg bg-white p-6 shadow-sm'>form here</div>
      </main>
    </div>
  )
}

export default Home
