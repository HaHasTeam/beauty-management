import * as React from 'react'

import { Sheet, SheetContent } from '@/components/ui/sheet'
import { IReport } from '@/types/report'

interface ViewDetailsReportSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  Report?: IReport
}

export function ViewDetailsReportSheet({ ...props }: ViewDetailsReportSheetProps) {
  return (
    <Sheet {...props}>
      <SheetContent className='flex flex-col gap-6 sm:max-w-xl max-sm:w-full'>sdf</SheetContent>
    </Sheet>
  )
}
