import * as React from 'react'


import { cn } from '@/lib/utils'

interface CardWithFacetFiltersProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode | null
  mainContent?: React.ReactNode | null
}

export function CardWithFacetFilters({  children, className, mainContent,...props }: CardWithFacetFiltersProps) {
  return (
    <div className={cn('w-full space-y-2.5 overflow-auto', className)} {...props}>
      {children}
      <div className='overflow-hidden'>
        {mainContent}
      </div>
    </div>
  )
}
