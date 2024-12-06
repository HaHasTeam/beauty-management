import { cn } from '@/lib/utils'
import { IStepper } from '@/types/stepper'

import { Separator } from '../ui/separator'

interface StepTrackingProps {
  steps: IStepper[]
  currentSteps: number
  setCurrentSteps: React.Dispatch<number[]>
  orientation: 'vertical' | 'horizontal'
}
const StepTracking = ({ steps, currentSteps, setCurrentSteps, orientation = 'horizontal' }: StepTrackingProps) => {
  const separatorWidth = `calc(100% / ${steps?.length})`
  return (
    <div
      className={cn('w-full flex justify-center items-center', orientation === 'vertical' ? 'flex-col' : 'flex-row')}
    >
      {steps?.map((step, index) => (
        <div key={step.id} className={cn(`flex flex-row items-center w-[${separatorWidth}] justify-between`)}>
          {/* Step */}
          <div
            className={cn(
              `flex justify-center items-center w-10 h-10 rounded-full text-white ${
                step?.isActive
                  ? 'bg-primary hover:bg-primary/80'
                  : 'bg-secondary text-secondary-foreground border-secondary'
              }`
            )}
          >
            {step?.id}
          </div>

          {/* Separator */}
          {index < steps.length - 1 && (
            <Separator
              orientation={orientation}
              className={cn(orientation === 'horizontal' ? 'w-1/2 h-[2px]' : 'h-6 w-[2px]', 'bg-gray-300')}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default StepTracking
