import * as React from 'react'

import CardSection from '@/components/card-section'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { TBrand } from '@/types/brand'

interface ViewDetailsBrandsSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  TBrand?: TBrand
}

export function ViewDetailsBrandsSheet({ TBrand, ...props }: ViewDetailsBrandsSheetProps) {
  return (
    <Sheet {...props}>
      <SheetContent className='flex flex-col gap-6 sm:max-w-xl max-sm:w-full'>
        <CardSection
          title={TBrand?.name}
          description={`View ${TBrand?.name}'s profile details and PreOrder information.`}
          rightComponent={
            <Avatar className='size-20 object-cover aspect-square p-0.5 rounded-full border bg-accent shadow-lg'>
              <AvatarImage src={TBrand?.logo ? TBrand?.logo : ''} />
              <AvatarFallback>{TBrand?.name}</AvatarFallback>
            </Avatar>
          }
        >
          <div className='grid max-sm:grid-cols-1 grid-cols-2 gap-2'></div>
        </CardSection>
      </SheetContent>
    </Sheet>
  )
}
