import LoadingIcon from '.'

type Props = {
  label?: string
}

const LoadingLayer = ({ label }: Props) => {
  return (
    <div className='w-screen h-screen flex justify-center items-center bg-primary/20 z-50 fixed inset-0'>
      <LoadingIcon label={label} />
    </div>
  )
}

export default LoadingLayer
