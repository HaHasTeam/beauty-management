import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const shellVariants = cva('grid items-center gap-8 w-full', {
  variants: {
    variant: {
      default: '',
      sidebar: '',
      centered: 'flex h-dvh max-w-2xl flex-col justify-center',
      markdown: 'max-w-3xl py-8 md:py-10 lg:py-10'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

interface ShellProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof shellVariants> {
  as?: React.ElementType
}

function Shell({ className, as: Comp = 'section', variant, ...props }: ShellProps) {
  return <Comp className={cn(shellVariants({ variant }), className)} {...props} />
}

export { Shell, shellVariants }
