import { ArrowRight } from 'lucide-react'
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

import type { Steppers } from '@/hooks/useStepper'
import { useClientStore } from '@/stores/store'

import { Button } from '../ui/button'

type Props = {
  stepIndex: number
  goNextFn: (number?: number) => void
  goBackfn?: (number?: number) => void
  steppers: Steppers[]
}
function BranchCreation({ stepIndex, goNextFn, steppers }: Props) {
  const { setBranchStep } = useClientStore(
    useShallow((state) => {
      return {
        branchStep: state.stepStore,
        setBranchStep: state.setStepStore
      }
    })
  )

  useEffect(() => {
    setBranchStep({
      step: stepIndex,
      data: {}
    })
  }, [setBranchStep, stepIndex])

  return (
    <div className='relative flex size-full flex-col items-center justify-center  '>
      <div className='text-center'>
        <h1 className='text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl'>
          Welcome to <span className='text-primary'>Allure</span>
        </h1>
        <p className='mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl'>
          Create, grow, and manage your brand on our powerful selling platform. Start your journey to success today!
        </p>
        <div className='mt-10'>
          <Button
            onClick={() => {
              goNextFn()
            }}
            // className='flex w-full select-none items-center justify-center gap-2 px-4'
            disabled={stepIndex === steppers.length}
            className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
          >
            Create Your Brand
            <ArrowRight className='ml-2 -mr-1 h-5 w-5' />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BranchCreation
