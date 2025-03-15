import * as React from 'react'

import { Sheet, SheetContent } from '@/components/ui/sheet'
import { ISystemService } from '@/types/system-service'

interface ViewDetailsSystemServiceSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  SystemService?: ISystemService
}

export function ViewDetailsSystemServiceSheet({ ...props }: ViewDetailsSystemServiceSheetProps) {
  return (
    <Sheet {...props}>
      <SheetContent className='flex flex-col gap-6 sm:max-w-xl max-sm:w-full'>sdf</SheetContent>
    </Sheet>
  )
}
