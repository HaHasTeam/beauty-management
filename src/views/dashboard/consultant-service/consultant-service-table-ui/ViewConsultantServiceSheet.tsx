import * as React from 'react'

import { Sheet, SheetContent } from '@/components/ui/sheet'
import { IConsultantService } from '@/types/consultant-service'

interface ViewDetailsConsultantServiceSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  ConsultantService?: IConsultantService
}

export function ViewDetailsConsultantServiceSheet({ ...props }: ViewDetailsConsultantServiceSheetProps) {
  return (
    <Sheet {...props}>
      <SheetContent className='flex flex-col gap-6 sm:max-w-xl max-sm:w-full'>sdf</SheetContent>
    </Sheet>
  )
}
