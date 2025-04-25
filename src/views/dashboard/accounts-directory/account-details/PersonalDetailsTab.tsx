import { format } from 'date-fns'
import { CircleSlash } from 'lucide-react'
import * as React from 'react'

import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { PhoneInputWithCountries } from '@/components/phone-input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TUserResponse } from '@/network/apis/user/type'
import { UserGenderEnum } from '@/types/user'

// Custom read-only styled component that looks like a form field but is read-only
const ReadOnlyField = ({ label, value }: { label: string; value: string | undefined }) => {
  return (
    <div className='space-y-2'>
      <div className='text-sm font-medium text-foreground'>{label}</div>
      <div className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground'>
        {value ? (
          value
        ) : (
          <span className='flex items-center gap-1 text-muted-foreground'>
            <CircleSlash className='h-3.5 w-3.5' />
            <span>N/A</span>
          </span>
        )}
      </div>
    </div>
  )
}

interface PersonalDetailsTabProps {
  account?: TUserResponse
  isLoading: boolean
}

const PersonalDetailsTab: React.FC<PersonalDetailsTabProps> = ({ account, isLoading }) => {
  if (isLoading) {
    return (
      <Card className='relative'>
        <LoadingContentLayer />
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  if (!account) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>Account not found</CardContent>
      </Card>
    )
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return undefined
    try {
      return format(new Date(dateString), 'yyyy-MM-dd')
    } catch {
      return undefined
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid gap-4 md:grid-cols-2'>
          <ReadOnlyField label='First Name' value={account.firstName} />
          <ReadOnlyField label='Last Name' value={account.lastName} />
          <ReadOnlyField label='Username' value={account.username} />
          <ReadOnlyField label='Email Address' value={account.email} />

          <div className='space-y-2'>
            <div className='text-sm font-medium'>Gender</div>
            <Select disabled defaultValue={account.gender}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select gender' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserGenderEnum.MALE}>Male</SelectItem>
                <SelectItem value={UserGenderEnum.FEMALE}>Female</SelectItem>
                <SelectItem value={UserGenderEnum.OTHER}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <div className='text-sm font-medium'>Phone Number</div>
            <PhoneInputWithCountries
              id='phoneNumber'
              className='w-full'
              value={account.phone}
              disabled
              onChange={() => {}}
            />
          </div>

          <ReadOnlyField label='Date of Birth' value={formatDate(account.dob)} />
        </div>
      </CardContent>
    </Card>
  )
}

export default PersonalDetailsTab
