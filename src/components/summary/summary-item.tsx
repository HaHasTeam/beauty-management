import { ReactNode } from 'react'

type Props = {
  label: ReactNode
  value?: ReactNode
}

const SummeryItem = (props: Props) => {
  return (
    <div className='flex flex-col justify-start'>
      <h2 className='text-md font-semibold'>{props.label}</h2>
      <p className='text-sm list-disc text-foreground/70'>
        <li className='text-nowrap text-ellipsis overflow-hidden'>{props.value || '--'}</li>
      </p>
    </div>
  )
}

export default SummeryItem
