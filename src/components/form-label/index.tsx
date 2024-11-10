import { FormLabel } from '@/components/ui/form'

type Props = {
  required?: boolean
  children: React.ReactNode
}

const index = ({ required, children }: Props) => {
  return (
    <FormLabel className='flex items-center gap-1'>
      {children}
      {required && <span className='text-destructive'>*</span>}
    </FormLabel>
  )
}

export default index
