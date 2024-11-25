import type { Stepper as StepperHok } from '@stepperize/react'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import { IStepper } from '@/types/types'

import Separator from '../auth-ui/Separator'

function Stepper({
  isCompleted,
  step,
  stepperHook,
  index
}: {
  isCompleted: boolean
  step: IStepper
  stepperHook: StepperHok
  index: number
}) {
  return (
    <div key={step.id} className='flex flex-1 items-center'>
      <div className='flex flex-col items-center flex-1'>
        <div className='flex items-center relative'>
          {/* Step indicator */}
          <div
            className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium', {
              'bg-indigo-600 text-white': isCompleted || stepperHook.current,
              'bg-gray-100 text-gray-500': !isCompleted && !stepperHook.current
            })}
          >
            {isCompleted ? <Check className='h-5 w-5' /> : <span>{index + 1}</span>}
          </div>

          {/* Connecting line */}

          <div
            className={cn('h-[2px] w-full absolute left-8', {
              'bg-indigo-600': isCompleted,
              'bg-red-200': !isCompleted
            })}
            style={{ width: 'calc(100% - 2rem)' }}
          />
        </div>

        {/* Step content */}
        <div className='mt-3 space-y-1 text-center'>
          <div
            className={cn('text-sm font-medium', {
              'text-indigo-600': isCompleted || stepperHook.current,
              'text-gray-500': !isCompleted && !stepperHook.current
            })}
          >
            {step.title}
          </div>
          <p className='text-sm text-gray-500 max-w-[12rem] mx-auto'>{step.description}</p>
        </div>
      </div>

      <div
        className='flex justify-center'
        style={{
          paddingInlineStart: '1.25rem'
        }}
      >
        <Separator
          text=''
          // className={`w-[1px] h-full ${index < stepper.current.index ? 'bg-primary' : 'bg-muted'}`}
        />
      </div>
    </div>
  )
}

export default Stepper
