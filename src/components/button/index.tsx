import { forwardRef } from 'react'

import LoadingIcon from '../loading-icon'
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from '../ui/button'

type ButtonProps = ShadcnButtonProps & {
  loading?: boolean
}
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, className, ...props }, ref) => {
  return (
    <ShadcnButton ref={ref} className={className} {...props} disabled={props.disabled || props.loading}>
      {props.loading ? <LoadingIcon /> : children}
    </ShadcnButton>
  )
})

Button.displayName = 'Button'
export default Button
