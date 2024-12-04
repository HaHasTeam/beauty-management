import * as React from 'react'

import CardSection from '@/components/card-section'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { TPreOrder } from '@/types/pre-order'

interface ViewDetailsPreOrderSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  PreOrder?: TPreOrder
}

export function ViewDetailsPreOrderSheet({ PreOrder, ...props }: ViewDetailsPreOrderSheetProps) {
  return (
    <Sheet {...props}>
      <SheetContent className='flex flex-col gap-6 sm:max-w-xl max-sm:w-full'>
        <CardSection
          title={PreOrder?.product.name + "'s Profile"}
          description={`View ${PreOrder?.product.name}'s profile details and PreOrder information.`}
          rightComponent={
            <Avatar className='size-20 object-cover aspect-square p-0.5 rounded-full border bg-accent shadow-lg'>
              <AvatarImage src={PreOrder?.images?.length ? PreOrder?.images[0] : ''} />
              <AvatarFallback>{PreOrder?.product.name}</AvatarFallback>
            </Avatar>
          }
        >
          <div className='grid max-sm:grid-cols-1 grid-cols-2 gap-2'></div>
        </CardSection>
      </SheetContent>
    </Sheet>
  )
}
