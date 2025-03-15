import { Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import Button from '../button'

type AlertMessageProps = {
  message: string
  className?: string
  size?: 'small' | 'medium' | 'large'
  textSize?: 'small' | 'medium' | 'large'
  titleSize?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'secondary' | 'accent' | 'warn' | 'black' | 'danger' | 'success'
  text?: 'primary' | 'secondary' | 'accent' | 'black' | 'black' | 'danger' | 'success'
  titleClassName?: string
  title?: string
  isShowIcon?: boolean
  onClick?: () => void
  buttonText?: string
  buttonClassName?: string
}
const AlertMessage = ({
  message,
  className,
  size = 'medium',
  color = 'warn',
  text = 'black',
  textSize = 'medium',
  titleClassName,
  title,
  titleSize = 'large',
  isShowIcon = true,
  buttonText,
  buttonClassName,
  onClick
}: AlertMessageProps) => {
  const { t } = useTranslation()
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
    accent: 'text-accent',
    success: 'text-green-500'
  }

  const textColorClasses = {
    danger: 'text-red-600',
    black: 'text-foreground',
    warn: 'text-foreground',
    primary: 'text-primary-foreground',
    secondary: 'text-secondary-foreground',
    accent: 'text-accent-foreground',
    success: 'text-foreground'
  }
  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-lg'
  }
  const alertVariant = {
    primary: 'bg-primary-50 border-primary-300',
    secondary: 'bg-white border-secondary-300',
    accent: 'bg-accent-50 border-accent-300',
    warn: 'bg-yellow-50 border-yellow-300',
    black: 'bg-black border-black-300',
    danger: 'bg-red-100 border-red-300',
    success: 'bg-green-100 border-green-300'
  }
  return (
    <div className={`rounded-lg p-3 border flex items-center justify-between ${alertVariant[color]} ${className}`}>
      <div>
        {title && (
          <span
            className={`${isShowIcon && 'ml-5'} uppercase md:text-base sm:text-sm text-xs font-bold ${iconColorClasses[color]} ${titleClassName} ${textSizeClasses[titleSize]}`}
          >
            {title}
          </span>
        )}
        <div className='flex items-center gap-2'>
          {isShowIcon && (
            <div>
              <Info className={`flex items-center ${sizeClasses[size]} ${iconColorClasses[color]}`} size={24} />
            </div>
          )}
          <span className={`${textColorClasses[text]} ${textSizeClasses[textSize]}`}>{message}</span>
        </div>
      </div>
      {buttonText && (
        <Button type='button' onClick={onClick} className={buttonClassName}>
          {t(`button.${buttonText}`)}
        </Button>
      )}
    </div>
  )
}

export default AlertMessage
