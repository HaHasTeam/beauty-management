import * as React from 'react'

import { Sheet, SheetContent } from '@/components/ui/sheet'
import { IBlogDetails } from '@/types/blog'

interface ViewDetailsBlogSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  Blog?: IBlogDetails
}

export function ViewDetailsBlogSheet({ ...props }: ViewDetailsBlogSheetProps) {
  return (
    <Sheet {...props}>
      <SheetContent className='flex flex-col gap-6 sm:max-w-xl max-sm:w-full'>sdf</SheetContent>
    </Sheet>
  )
}
