import { Mail, MapPin, Phone } from 'lucide-react'
import * as React from 'react'

import InfoItem from '@/components/branch/InforItem'
import CardSection from '@/components/card-section'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { TVoucher } from '@/types/voucher'

interface ViewDetailsVouchersSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  Voucher?: TVoucher
}

export function ViewDetailsVouchersSheet({ Voucher, ...props }: ViewDetailsVouchersSheetProps) {
  return (
    <Sheet {...props}>
      <SheetContent className='flex flex-col gap-6 sm:max-w-xl max-sm:w-full'>
        <CardSection
          title={Voucher?.name}
          description={Voucher?.description}
          rightComponent={
            <Avatar className='size-20 object-cover aspect-square p-0.5 rounded-full border bg-accent shadow-lg'>
              <AvatarImage src={Voucher?.code ? Voucher?.code : ''} />
              <AvatarFallback>{Voucher?.name?.charAt(0)?.toUpperCase() ?? 'A'}</AvatarFallback>
            </Avatar>
          }
        >
          <div className='grid max-sm:grid-cols-1 grid-cols-1 gap-2'>
            <InfoItem
              icon={<Mail className='w-5 h-5 text-primary' />}
              label='Email'
              value={Voucher?.amount?.toString() || 'N/A'}
            />
            <InfoItem
              icon={<Phone className='w-5 h-5 text-primary' />}
              label='Phone'
              value={Voucher?.discountValue.toString() || 'N/A'}
            />
            <InfoItem
              // className='col-span-2'
              icon={<MapPin className='w-5 h-5 text-primary ' />}
              label='Address'
              value={Voucher?.discountType || 'N/A'}
            />
            <div className=''></div>
          </div>
        </CardSection>
      </SheetContent>
    </Sheet>
  )
}
