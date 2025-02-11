import { ReactElement } from 'react'

interface CircleStyleIconProps {
  icon?: ReactElement<unknown>
  className?: string
  size?: 'small' | 'medium' | 'large'
}
const CircleStyleIcon = ({ icon, className, size = 'medium' }: CircleStyleIconProps) => {
  const sizeClasses = {
    small: 'p-1',
    medium: 'p-4',
    large: 'p-6',
  }
  return <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center ${className}`}>{icon}</div>
}

export default CircleStyleIcon
