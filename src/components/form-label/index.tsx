import { HtmlHTMLAttributes } from 'react'

import { FormLabel } from '@/components/ui/form'

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  required?: boolean
  children: React.ReactNode
}

const index = ({ required, children, className }: Props) => {
  return (
    <FormLabel className={`flex items-center gap-1 ${className}`}>
      {required && <span className='text-destructive'>*</span>}
      {children}
    </FormLabel>
  )
}

export default index
