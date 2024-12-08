import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import { IStepper } from '@/types/stepper'

import { Separator } from '../ui/separator'

interface StepTrackingProps {
  steps: IStepper[]
  completeSteps: number[]
  orientation: 'vertical' | 'horizontal'
  setActiveStep: React.Dispatch<number>
  activeStep: number
}
interface StepTrackingVerticalProps {
  steps: IStepper[]
  completeSteps: number[]
  setActiveStep: React.Dispatch<number>
  activeStep: number
}
const StepTracking = ({
  steps,
  completeSteps,
  orientation = 'horizontal',
  activeStep,
  setActiveStep
}: StepTrackingProps) => {
  const stepWidth = `1/${steps.length - 1}`
  return (
    <div
      className={cn(
        `w-full flex md:px-10 px-2`,
        orientation === 'vertical'
          ? 'flex-col md:items-start items-center justify-center'
          : 'flex-row gap-2 justify-center items-center'
      )}
    >
      {steps?.map((step, index) => (
        <div
          key={step.id}
          className={cn(
            `flex hover:text-primary ${index !== steps?.length - 1 ? `w-${stepWidth}` : `w-${stepWidth}`}`,
            activeStep === index + 1 && 'text-primary hover:text-primary/80',
            orientation === 'vertical'
              ? 'flex-row md:items-start items-center md:gap-3 gap-0'
              : 'flex-row items-center justify-between'
          )}
        >
          {/* Step */}
          <div className='flex-col'>
            <div
              onClick={() => setActiveStep(step.id)}
              className={cn(
                `flex justify-center items-center ${index !== steps?.length - 1 ? (orientation === 'vertical' ? 'w-[50px]' : `w-[110px]`) : 'w-[50px]'} h-[50px] rounded-full cursor-pointer ${
                  activeStep === index + 1
                    ? 'bg-primary hover:bg-primary/80 text-white'
                    : 'bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/70 '
                }`
              )}
            >
              {completeSteps?.includes(step?.id) ? (
                <Check className='flex justify-center items-center' />
              ) : (
                <span>{step?.id}</span>
              )}
            </div>
            {/* Separator */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  `w-full ${index !== steps?.length - 1 ? `w-${stepWidth}` : 'w-[60px]'}`,
                  orientation === 'vertical' ? 'flex justify-center my-3' : 'mx-3'
                )}
              >
                <Separator
                  orientation={orientation}
                  className={cn(orientation === 'horizontal' ? 'h-[2px]' : 'h-6 w-[2px]', 'bg-gray-300')}
                />
              </div>
            )}
          </div>
          <div
            onClick={() => setActiveStep(step.id)}
            className={cn(
              `cursor-pointer font-medium hidden sm:block`,
              orientation === 'vertical' ? 'h-[50px] flex items-center' : 'flex-row items-center justify-between'
            )}
          >
            <span className='hidden md:block md:text-base text-sm'>{step?.title}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StepTracking

export const StepTrackingVertical = ({
  steps,
  completeSteps,
  activeStep,
  setActiveStep
}: StepTrackingVerticalProps) => {
  return (
    <div className='lg:w-[280px] md:w-[230px] w-[80px] rounded-lg bg-white lg:pb-4 md:pb-10 py-4 flex flex-col items-center'>
      <StepTracking
        steps={steps}
        completeSteps={completeSteps}
        orientation={'vertical'}
        setActiveStep={setActiveStep}
        activeStep={activeStep}
      />
    </div>
  )
}
