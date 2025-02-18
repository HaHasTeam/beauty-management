import { Star } from 'lucide-react'
// eslint-disable-next-line import/default
import React, { cloneElement, HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

const ratingVariants = {
  default: {
    star: 'text-foreground',
    emptyStar: 'text-muted-foreground'
  },
  destructive: {
    star: 'text-red-500',
    emptyStar: 'text-red-200'
  },
  yellow: {
    star: 'text-yellow-500',
    emptyStar: 'text-yellow-200'
  }
}

interface RatingsProps extends HTMLAttributes<HTMLDivElement> {
  rating: number
  totalStars?: number
  size?: number
  fill?: boolean
  Icon?: React.ReactElement
  variant?: keyof typeof ratingVariants
}

const Ratings = ({ ...props }: RatingsProps) => {
  const { rating, totalStars = 5, size = 20, fill = true, Icon = <Star />, variant = 'default' } = props

  const fullStars = Math.floor(rating)
  const partialStar =
    rating % 1 > 0 ? (
      <PartialStar fillPercentage={rating % 1} size={size} className={cn(ratingVariants[variant].star)} Icon={Icon} />
    ) : null

  return (
    <div className={cn('flex items-center gap-2')} {...props}>
      {[...Array(fullStars)]?.map((_, i) =>
        cloneElement(Icon, {
          key: i,
          size,
          className: cn(fill ? 'fill-current' : 'fill-transparent', ratingVariants[variant].star)
        })
      )}
      {partialStar}
      {[...Array(totalStars - fullStars - (partialStar ? 1 : 0))].map((_, i) =>
        cloneElement(Icon, {
          key: i + fullStars + 1,
          size,
          className: cn(ratingVariants[variant].emptyStar)
        })
      )}
    </div>
  )
}

interface PartialStarProps {
  fillPercentage: number
  size: number
  className?: string
  Icon: React.ReactElement
}
const PartialStar = ({ ...props }: PartialStarProps) => {
  const { fillPercentage, size, className, Icon } = props

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {cloneElement(Icon, {
        size,
        className: cn('fill-transparent', className)
      })}
      <div
        style={{
          position: 'absolute',
          top: 0,
          overflow: 'hidden',
          width: `${fillPercentage * 100}%`
        }}
      >
        {cloneElement(Icon, {
          size,
          className: cn('fill-current', className)
        })}
      </div>
    </div>
  )
}

export { Ratings }
