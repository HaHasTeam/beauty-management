import { HtmlHTMLAttributes } from 'react'

import { FormLabel } from '@/components/ui/form'

type Props = HtmlHTMLAttributes<HTMLLabelElement> & {
  required?: boolean
  children: React.ReactNode
  htmlFor?: string
}

const index = ({ required, children, className, htmlFor, ...props }: Props) => {
  return (
    <FormLabel {...props} htmlFor={htmlFor} className={`flex items-center gap-1 ${className}`}>
      {required && <span className='text-destructive'>*</span>}
      {children}
    </FormLabel>
  )
}

export default index
