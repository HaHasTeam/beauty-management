import { Steppers } from '../../hooks/useStepper'

type Props = {
  steppers: Steppers[]
  activeStep: number
}

const Stepper = ({ steppers, activeStep }: Props) => {
  return (
    <ol className='mb-4 flex w-full items-center sm:mb-5 justify-center'>
      {steppers.map((step, index) => (
        <div className='w-full ' key={step.label}>
          <li
            key={step.label}
            className={
              index <= activeStep
                ? "flex w-full items-center  text-primary after:inline-block after:h-1 after:w-full after:border-4 after:border-b after:border-blue-100 after:content-[''] dark:text-blue-500 dark:after:border-blue-800"
                : "flex w-full items-center after:inline-block after:h-1 after:w-full after:border-4 after:border-b after:border-gray-100 after:content-[''] dark:after:border-gray-700"
            }
          >
            <div
              className={
                index <= activeStep
                  ? 'flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-200 dark:bg-blue-800 lg:size-12'
                  : 'flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 lg:size-12'
              }
            >
              {step.icon}
            </div>
          </li>
          {/* <p>{step.label}</p> */}
        </div>
      ))}

      <div className=''>
        <li className='flex w-fit items-center '>
          <div
            className={
              activeStep === steppers.length
                ? 'flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100  lg:size-12'
                : 'flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 lg:size-12'
            }
          >
            <svg
              className='size-4 text-primary dark:text-blue-300 lg:size-6'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 18 20'
            >
              <path d='M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z' />
            </svg>
          </div>
        </li>
        {/* <p>Confirm</p> */}
      </div>
    </ol>
  )
}

export default Stepper
