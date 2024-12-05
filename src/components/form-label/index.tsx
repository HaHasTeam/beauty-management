import { FormLabel } from '@/components/ui/form'

type Props = {
  required?: boolean
  children: React.ReactNode
  styleParent?: string
}

const index = ({ required, children, styleParent }: Props) => {
  return (
    <FormLabel className={`flex items-center gap-1 ${styleParent}`}>
      {required && <span className='text-destructive'>*</span>}
      {children}
    </FormLabel>
  )
}

export default index
