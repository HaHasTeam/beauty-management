import type { Stepper as StepperHok } from '@stepperize/react'

import { cn } from '@/lib/utils'
import { IStepper } from '@/types/types'

import Stepper from './stepper'

function Steppers({ steps, stepperHook }: { steps: IStepper[]; stepperHook: StepperHok }) {
  return (
    <div className={cn('w-full')}>
      <div className='flex items-center justify-between'>
        {steps.map((el, index) => (
          <Stepper index={index} step={el} isCompleted={true} stepperHook={stepperHook} />
        ))}
      </div>
    </div>
  )
}

export default Steppers
