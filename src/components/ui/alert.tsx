import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { ChevronsRight } from 'lucide-react'
import LoadingIcon from '../loading-icon'

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default:
          'border-gray-900/80 text-gray-800 dark:border-gray-500 [&>svg]:text-gray-500 bg-gray-300 dark:bg-gray-900 dark:text-gray-500 shadow-lg',
        destructive:
          'border-red-900/80 text-red-800 dark:border-red-500 [&>svg]:text-red-500 bg-red-300 dark:bg-red-900 dark:text-red-500 shadow-lg',
        warning:
          'border-yellow-900/80 text-yellow-800 dark:border-yellow-500 [&>svg]:text-yellow-500 bg-yellow-300 dark:bg-yellow-900 dark:text-yellow-500 shadow-lg',
        success:
          'border-green-900/80 text-green-800 dark:border-green-500 [&>svg]:text-green-500 bg-green-100 dark:bg-green-900 dark:text-green-500 shadow-lg',
        highlight:
          'border-purple-900/80 text-purple-800 dark:border-purple-500 [&>svg]:text-purple-500 bg-purple-300 dark:bg-purple-900 dark:text-purple-500 shadow-lg',
        information:
          'border-blue-900/80 text-blue-800 dark:border-blue-500 [&>svg]:text-blue-500 bg-blue-300 dark:bg-blue-900 dark:text-blue-500 shadow-lg'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

const actionVariants = cva('', {
  variants: {
    variant: {
      default: 'border-[1.5px] border-gray-700 text-gray-600  [&>svg]:text-gray-500 bg-gray-300',
      destructive: 'border-[1.5px] border-red-700 text-red-600  [&>svg]:text-red-500 bg-red-300',
      warning: 'border-[1.5px] border-yellow-700 text-yellow-600  [&>svg]:text-yellow-500 bg-yellow-300',
      success: 'border-[1.5px] border-green-700 text-green-600  [&>svg]:text-green-500 bg-green-300',
      highlight: 'border-[1.5px] border-purple-700 text-purple-600  [&>svg]:text-purple-500 bg-purple-300'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role='alert'
    className={cn(alertVariants({ variant }), 'relative flex items-center gap-2 justify-between', className)}
    {...props}
  />
))
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
  )
)
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
  )
)
AlertDescription.displayName = 'AlertDescription'

const AlertAction = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof actionVariants> & {
      loading?: boolean
    }
>(({ className, variant, children, loading = false, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'rounded-3xl shadow-2xl px-3 py-1 font-semibold flex items-center text-nowrap justify-center min-w-32',
      actionVariants({ variant }),
      className
    )}
    {...props}
  >
    {!loading ? (
      <>
        {children}
        <ChevronsRight strokeWidth={3.5} />
      </>
    ) : (
      <LoadingIcon size='medium' />
    )}
  </button>
))
AlertAction.displayName = 'AlertAction'

export { Alert, AlertTitle, AlertDescription, AlertAction }
