import * as React from 'react'

import CardSection from '@/components/card-section'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { TFlashSale } from '@/types/flash-sale'

interface ViewDetailsFlashSaleSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  FlashSale?: TFlashSale
}

export function ViewDetailsFlashSaleSheet({ FlashSale, ...props }: ViewDetailsFlashSaleSheetProps) {
  return (
    <Sheet {...props}>
      <SheetContent className='flex flex-col gap-6 sm:max-w-xl max-sm:w-full'>
        <CardSection
          title={FlashSale?.product.name + "'s Profile"}
          description={`View ${FlashSale?.product.name}'s profile details and FlashSale information.`}
          rightComponent={
            <Avatar className='size-20 object-cover aspect-square p-0.5 rounded-full border bg-accent shadow-lg'>
              <AvatarImage src={FlashSale?.images?.length ? FlashSale?.images[0] : ''} />
              <AvatarFallback>{FlashSale?.product.name}</AvatarFallback>
            </Avatar>
          }
        >
          <div className='grid max-sm:grid-cols-1 grid-cols-2 gap-2'></div>
        </CardSection>
      </SheetContent>
    </Sheet>
  )
}
