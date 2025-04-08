import { Building2, CheckCircle2, CircleSlash, Home, LucideIcon, MapPin, Phone, User, XCircle } from 'lucide-react'
import * as React from 'react'

import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TUserResponse } from '@/network/apis/user/type'
import { IAddress } from '@/types/address'
import { AddressEnum } from '@/types/enum'

// Address type icon component
const AddressTypeIcon = ({ type }: { type?: string }) => {
  switch (type) {
    case AddressEnum.HOME:
      return <Home className='h-3.5 w-3.5 text-amber-700' />
    case AddressEnum.OFFICE:
      return <Building2 className='h-3.5 w-3.5 text-blue-700' />
    default:
      return <MapPin className='h-3.5 w-3.5 text-gray-700' />
  }
}

// Status icon component
const StatusIcon = ({ status }: { status?: string }) => {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
      return <CheckCircle2 className='h-3.5 w-3.5 text-green-700' />
    case 'INACTIVE':
      return <XCircle className='h-3.5 w-3.5 text-red-700' />
    default:
      return <CircleSlash className='h-3.5 w-3.5 text-gray-700' />
  }
}

// Info item component with N/A fallback
const InfoItem = ({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value?: string }) => (
  <div className='flex items-center gap-2 group'>
    <Icon className='h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors' />
    <div className='flex items-center gap-1 min-w-0'>
      <span className='text-sm font-medium flex-shrink-0'>{label}:</span>
      <span className='text-sm break-words'>
        {value ? (
          value
        ) : (
          <span className='flex items-center gap-1 text-muted-foreground'>
            <CircleSlash className='h-3 w-3' />
            N/A
          </span>
        )}
      </span>
    </div>
  </div>
)

// Compact info item for location details
const LocationInfoItem = ({ value, label }: { value?: string; label: string }) => (
  <div className='flex items-center gap-1 group min-w-0'>
    <span className='text-sm text-muted-foreground flex-shrink-0'>{label}:</span>
    <span className='text-sm font-medium group-hover:text-primary transition-colors break-words'>
      {value ? (
        value
      ) : (
        <span className='flex items-center gap-1 text-muted-foreground'>
          <CircleSlash className='h-3 w-3' />
          N/A
        </span>
      )}
    </span>
  </div>
)

// Address card component
const AddressCard = ({ address }: { address: IAddress }) => {
  const getAddressTypeLabel = (type?: string) => {
    switch (type) {
      case AddressEnum.HOME:
        return 'Residential Address'
      case AddressEnum.OFFICE:
        return 'Business Address'
      default:
        return 'Other Location'
    }
  }

  const getStatusBadgeVariant = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'outline' as const
      case 'INACTIVE':
        return 'outline' as const
      default:
        return 'outline' as const
    }
  }

  const getStatusBadgeStyle = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'border-green-200 bg-green-50 text-green-700'
      case 'INACTIVE':
        return 'border-red-200 bg-red-50 text-red-700'
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700'
    }
  }

  const getTypeBadgeStyle = (type?: string) => {
    switch (type) {
      case AddressEnum.HOME:
        return 'border-amber-200 bg-amber-50 text-amber-700'
      case AddressEnum.OFFICE:
        return 'border-blue-200 bg-blue-50 text-blue-700'
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700'
    }
  }

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all hover:shadow-md border-border/50 bg-card/50 backdrop-blur-sm',
        address.isDefault && 'border-primary/20 dark:border-primary/30'
      )}
    >
      {address.isDefault && (
        <div className='absolute top-0 right-0'>
          <Badge variant='outline' className='border-blue-200 bg-blue-50 text-blue-700 rounded-bl-md'>
            Primary Address
          </Badge>
        </div>
      )}

      <Accordion type='single' collapsible className='w-full'>
        <AccordionItem value='address-details' className='border-0'>
          <AccordionTrigger className='p-3 hover:no-underline group'>
            <div className='flex items-center gap-3 w-full'>
              <div className='flex flex-col gap-0.5 min-w-0 flex-1'>
                <span className='text-base font-medium break-words group-hover:text-primary transition-colors'>
                  {address.fullName || 'Unnamed Address'}
                </span>
                <span className='text-sm text-muted-foreground break-words'>
                  {address.fullAddress || address.detailAddress || 'No address details'}
                </span>
              </div>
              <div className='flex items-center gap-1.5'>
                <Badge
                  variant='outline'
                  className={cn(
                    'flex items-center gap-1 px-2 py-0.5 transition-colors',
                    getTypeBadgeStyle(address.type)
                  )}
                >
                  <AddressTypeIcon type={address.type} />
                  {getAddressTypeLabel(address.type)}
                </Badge>
                {address.status && (
                  <Badge
                    variant={getStatusBadgeVariant(address.status)}
                    className={cn(
                      'flex items-center gap-1 px-2 py-0.5 transition-colors',
                      getStatusBadgeStyle(address.status)
                    )}
                  >
                    <StatusIcon status={address.status} />
                    {address.status}
                  </Badge>
                )}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className='p-3 pt-0'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <div className='space-y-2'>
                  <InfoItem icon={User} label='Name' value={address.fullName} />
                  <InfoItem icon={Phone} label='Phone' value={address.phone} />
                </div>
                <div className='space-y-2'>
                  <InfoItem icon={MapPin} label='Address' value={address.detailAddress} />
                  <div className='flex items-center gap-1.5 text-sm'>
                    <LocationInfoItem label='Ward' value={address.ward} />
                    <LocationInfoItem label='District' value={address.district} />
                    <LocationInfoItem label='Province' value={address.province} />
                  </div>
                </div>
              </div>
              {address.notes && (
                <div className='mt-3 text-sm text-muted-foreground break-words'>
                  <span className='font-medium'>Notes:</span> {address.notes}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}

interface AddressesTabProps {
  account?: TUserResponse
  isLoading: boolean
}

const AddressesTab: React.FC<AddressesTabProps> = ({ account, isLoading }) => {
  if (isLoading) {
    return (
      <Card className='relative'>
        <LoadingContentLayer />
        <CardHeader>
          <CardTitle>Addresses</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  if (!account) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Addresses</CardTitle>
        </CardHeader>
        <CardContent>Account not found</CardContent>
      </Card>
    )
  }

  const addresses = account.addresses || []

  if (addresses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center py-10 text-center'>
            <div className='rounded-full bg-muted p-3 mb-4'>
              <MapPin className='h-6 w-6 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-medium mb-2'>No Addresses Found</h3>
            <p className='text-sm text-muted-foreground max-w-md'>This account doesn't have any addresses saved yet.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Addresses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default AddressesTab
