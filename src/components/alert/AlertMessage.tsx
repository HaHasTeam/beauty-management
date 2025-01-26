import { Info } from 'lucide-react'

import { Alert, AlertDescription } from '../ui/alert'

type AlertMessageProps = {
  message: string
  className?: string
  size?: 'small' | 'medium' | 'large'
  textSize?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'secondary' | 'accent' | 'warn' | 'black' | 'danger'
  text?: 'primary' | 'secondary' | 'accent' | 'black' | 'danger'
}
const AlertMessage = ({
  message,
  className,
  size = 'medium',
  color = 'warn',
  text = 'black',
  textSize = 'medium'
}: AlertMessageProps) => {
  const sizeClasses = {
    small: 'w-2 h-2',
    medium: 'w-4',
    large: 'w-8 h-8'
  }

  const iconColorClasses = {
    danger: 'text-red-500',
    black: 'text-foreground',
    warn: 'text-yellow-500',
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent'
  }

  const textColorClasses = {
    danger: 'text-red-600',
    black: 'text-foreground',
    primary: 'text-primary-foreground',
    secondary: 'text-secondary-foreground',
    accent: 'text-accent-foreground'
  }
  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-base',
    large: 'text-lg'
  }
  return (
    <Alert variant='default' className={`bg-yellow-50 flex items-center ${className}`}>
      <AlertDescription className='flex items-center gap-2 border-0'>
        <Info className={`flex items-center ${sizeClasses[size]} ${iconColorClasses[color]}`} />
        <span className={`${textColorClasses[text]} ${textSizeClasses[textSize]}`}>{message}</span>
      </AlertDescription>
    </Alert>
  )
}

export default AlertMessage
