import * as React from 'react'

import CardSection from '@/components/card-section'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { IResponseProduct } from '@/types/product'

interface ViewDetailsProductSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  Product?: IResponseProduct
}

export function ViewDetailsProductSheet({ Product, ...props }: ViewDetailsProductSheetProps) {
  return (
    <Sheet {...props}>
      <SheetContent className='flex flex-col gap-6 sm:max-w-xl max-sm:w-full'>
        <CardSection
          title={Product?.name + "'s Profile"}
          description={`View ${Product?.name}'s profile details and Product information.`}
          rightComponent={
            <Avatar className='size-20 object-cover aspect-square p-0.5 rounded-full border bg-accent shadow-lg'>
              <AvatarImage src={Product?.images?.length ? Product?.images[0].fileUrl : ''} />
              <AvatarFallback>{Product?.name?.charAt(0)?.toUpperCase() ?? ''}</AvatarFallback>
            </Avatar>
          }
        >
          <div className='grid max-sm:grid-cols-1 grid-cols-2 gap-2'></div>
        </CardSection>
      </SheetContent>
    </Sheet>
  )
}
