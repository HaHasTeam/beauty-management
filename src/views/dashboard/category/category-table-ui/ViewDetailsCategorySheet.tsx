import * as React from 'react'

import { Sheet, SheetContent } from '@/components/ui/sheet'
import { ICategory } from '@/types/category'

interface ViewDetailsCategorySheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  Category?: ICategory
}

export function ViewDetailsCategorySheet({ ...props }: ViewDetailsCategorySheetProps) {
  return (
    <Sheet {...props}>
      <SheetContent className='flex flex-col gap-6 sm:max-w-xl max-sm:w-full'>sdf</SheetContent>
    </Sheet>
  )
}
