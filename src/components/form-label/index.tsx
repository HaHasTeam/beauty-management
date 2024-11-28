import { FormLabel } from '@/components/ui/form'

type Props = {
  required?: boolean
  children: React.ReactNode
}

const index = ({ required, children }: Props) => {
  return (
    <FormLabel className='flex items-center gap-1'>
      {required && <span className='text-destructive'>*</span>}
      {children}
    </FormLabel>
  )
}

export default index
