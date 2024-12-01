import { format } from 'date-fns'
import * as React from 'react'

import CardSection from '@/components/card-section'
import SummeryItem from '@/components/summary/summary-item'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { TUser } from '@/types/user'

interface ViewDetailsAccountSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  account?: TUser
}

export function ViewDetailsAccountSheet({ account, ...props }: ViewDetailsAccountSheetProps) {
  return (
    <Sheet {...props}>
      <SheetContent className='flex flex-col gap-6 sm:max-w-xl max-sm:w-full'>
        <CardSection
          title={account?.username + "'s Profile"}
          description={`View ${account?.username}'s profile details and account information.`}
          rightComponent={
            <Avatar className='size-20 object-cover aspect-square p-0.5 rounded-full border bg-accent shadow-lg'>
              <AvatarImage src={account?.avatar} />
              <AvatarFallback>{account?.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          }
        >
          <div className='grid max-sm:grid-cols-1 grid-cols-2 gap-2'>
            <SummeryItem
              label='Display Name'
              value={account?.firstName || account?.lastName ? account?.firstName + ' ' + account?.lastName : undefined}
            />
            <SummeryItem label='User Name' value={account?.username} />
            <SummeryItem label='Email Address' value={account?.email} />
            <SummeryItem label='Phone Number' value={account?.phone} />
            <SummeryItem label='Date of Birth' value={account?.dob && format(new Date(account?.dob), 'PPP p')} />
            <SummeryItem label='User Gender' value={account?.gender} />
            <SummeryItem label='Current Role' value={account?.role} />
            <SummeryItem
              label='Created At'
              value={account?.createdAt && format(new Date(account?.createdAt), 'PPP p')}
            />
            <SummeryItem
              label='Last Updated At'
              value={
                account?.updatedAt
                  ? format(new Date(account?.updatedAt), 'PPP p')
                  : account?.createdAt && format(new Date(account?.createdAt), 'PPP p')
              }
            />
          </div>
        </CardSection>
      </SheetContent>
    </Sheet>
  )
}
