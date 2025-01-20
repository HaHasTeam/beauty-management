import * as React from 'react'

import { Sheet, SheetContent } from '@/components/ui/sheet'
import { TGroupProduct } from '@/types/group-product'

interface ViewDetailsGroupProductSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  GroupProduct?: TGroupProduct
}

export function ViewDetailsGroupProductSheet({ ...props }: ViewDetailsGroupProductSheetProps) {
  return (
    <Sheet {...props}>
      <SheetContent className='flex flex-col gap-6 sm:max-w-xl max-sm:w-full'></SheetContent>
    </Sheet>
  )
}
