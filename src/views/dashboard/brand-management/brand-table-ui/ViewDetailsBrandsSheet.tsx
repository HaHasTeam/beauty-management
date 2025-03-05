import { Mail, MapPin, Phone } from 'lucide-react'
import * as React from 'react'

import InfoItem from '@/components/branch/InforItem'
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
          description={TBrand?.description}
          rightComponent={
            <Avatar className='size-20 object-cover aspect-square p-0.5 rounded-full border bg-accent shadow-lg'>
              <AvatarImage src={TBrand?.logo ? TBrand?.logo : ''} />
              <AvatarFallback>{TBrand?.name?.charAt(0)?.toUpperCase() ?? ''}</AvatarFallback>
            </Avatar>
          }
        >
          <div className='grid max-sm:grid-cols-1 grid-cols-1 gap-2'>
            <InfoItem icon={<Mail className='w-5 h-5 text-primary' />} label='Email' value={TBrand?.email || 'N/A'} />
            <InfoItem icon={<Phone className='w-5 h-5 text-primary' />} label='Phone' value={TBrand?.phone || 'N/A'} />
            <InfoItem
              // className='col-span-2'
              icon={<MapPin className='w-5 h-5 text-primary ' />}
              label='Address'
              value={TBrand?.address || 'N/A'}
            />
            <div className=''></div>
          </div>
        </CardSection>
      </SheetContent>
    </Sheet>
  )
}
