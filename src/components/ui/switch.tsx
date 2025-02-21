import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

type SwitchSize = 'small' | 'medium' | 'large'

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  size?: SwitchSize
}

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, SwitchProps>(
  ({ className, size = 'large', ...props }, ref) => {
    // Define size-based classes
    const sizeClasses = {
      small: {
        root: 'h-4 w-8',
        thumb: 'h-3 w-3',
        thumbTranslate: 'data-[state=checked]:translate-x-4'
      },
      medium: {
        root: 'h-6 w-11',
        thumb: 'h-5 w-5',
        thumbTranslate: 'data-[state=checked]:translate-x-5'
      },
      large: {
        root: 'h-9 w-24',
        thumb: 'h-6 w-6',
        thumbTranslate: 'data-[state=checked]:translate-x-[67px]'
      }
    }

    const sizeClass = sizeClasses[size]
    return (
      <SwitchPrimitives.Root
        className={cn(
          'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
          sizeClass.root,
          className
        )}
        {...props}
        ref={ref}
      >
        <SwitchPrimitives.Thumb
          className={cn(
            'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[67px] data-[state=unchecked]:translate-x-0',
            sizeClass.thumb,
            sizeClass.thumbTranslate
          )}
        />
      </SwitchPrimitives.Root>
    )
  }
)
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
