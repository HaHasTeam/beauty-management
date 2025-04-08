import { format } from 'date-fns'
import {
  AtSign,
  Cake,
  Calendar,
  CircleSlash,
  InfoIcon,
  Mail,
  MapPin,
  Phone,
  Shield,
  Star,
  Tag,
  User2,
  UserCircle,
  Users
} from 'lucide-react'
import * as React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { TUser, UserStatusEnum } from '@/types/user'

import { getStatusIcon } from './helper'

interface ViewDetailsAccountDialogProps extends React.ComponentPropsWithRef<typeof Dialog> {
  account?: TUser
  onOpenChange?: (open: boolean) => void
}

// Custom item component with icon
const ProfileItem = ({ label, value, icon: Icon }: { label: string; value?: string; icon: React.ElementType }) => (
  <div className='flex items-start gap-3 bg-accent/40 rounded-lg p-2.5 hover:bg-accent/60 transition-colors'>
    <div className='bg-primary/10 text-primary rounded-md p-1.5 flex-shrink-0'>
      <Icon className='h-4 w-4' />
    </div>
    <div className='flex-1 min-w-0'>
      <p className='text-sm font-medium text-muted-foreground'>{label}</p>
      {value ? (
        <p className='text-sm font-medium truncate'>{value}</p>
      ) : (
        <div className='flex items-center gap-1 text-sm text-muted-foreground/70'>
          <CircleSlash className='h-3 w-3' />
          <span>Not available</span>
        </div>
      )}
    </div>
  </div>
)

export function ViewDetailsAccountDialog({ account, onOpenChange, ...props }: ViewDetailsAccountDialogProps) {
  if (!account) return null

  // Get display name
  const getDisplayName = () => {
    if (account.firstName || account.lastName) {
      return `${account.firstName || ''} ${account.lastName || ''}`.trim()
    } else if (account.username) {
      return account.username
    } else if (account.email) {
      return account.email
    }
    return 'Unknown User'
  }

  const displayName = getDisplayName()
  const statusIconInfo = account.status ? getStatusIcon(account.status as UserStatusEnum) : null

  return (
    <Dialog {...props} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md p-0 overflow-hidden rounded-xl border-none shadow-lg'>
        <div className='h-24 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 relative'>
          <DialogHeader className='absolute inset-x-0 top-4 px-5 z-10'>
            <DialogTitle className='text-white font-medium flex items-center gap-2'>
              <InfoIcon className='h-5 w-5' />
              User Profile
            </DialogTitle>
          </DialogHeader>

          <Avatar className='absolute -bottom-8 left-5 size-16 border-4 border-white shadow-md'>
            <AvatarImage src={account.avatar} />
            <AvatarFallback className='text-lg bg-primary text-white font-semibold'>
              {account.username ? account.username[0].toUpperCase() : '?'}
            </AvatarFallback>
          </Avatar>

          {statusIconInfo && (
            <Badge
              className={`absolute top-4 right-5 ${statusIconInfo.bgColor} ${statusIconInfo.textColor} py-1 px-2.5 text-xs font-medium`}
            >
              <statusIconInfo.icon className='h-3.5 w-3.5 mr-1' />
              <span className='capitalize'>{account.status.toLowerCase()}</span>
            </Badge>
          )}
        </div>

        <ScrollArea className='max-h-[440px] pt-8'>
          <div className='px-5 pb-5'>
            <div className='ml-14 mb-4'>
              <h2 className='text-lg font-bold tracking-tight'>{displayName}</h2>
              <p className='text-sm text-muted-foreground font-medium'>{account.role || 'No role assigned'}</p>

              <div className='flex flex-wrap gap-4 mt-2.5 text-sm'>
                {account.email && (
                  <div className='flex items-center gap-1.5'>
                    <Mail className='h-4 w-4 text-primary' />
                    <span>{account.email}</span>
                  </div>
                )}
                {account.phone && (
                  <div className='flex items-center gap-1.5'>
                    <Phone className='h-4 w-4 text-primary' />
                    <span>{account.phone}</span>
                  </div>
                )}
                {account.createdAt && (
                  <div className='flex items-center gap-1.5'>
                    <Calendar className='h-4 w-4 text-primary' />
                    <span>Joined {format(new Date(account.createdAt), 'MM/dd/yyyy')}</span>
                  </div>
                )}
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <h3 className='flex items-center gap-2 text-sm font-semibold mb-3'>
                  <div className='bg-primary/10 text-primary rounded-md p-1.5'>
                    <User2 className='h-4 w-4' />
                  </div>
                  Personal Information
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  <ProfileItem label='First Name' value={account.firstName} icon={UserCircle} />
                  <ProfileItem label='Last Name' value={account.lastName} icon={UserCircle} />
                  <ProfileItem label='Username' value={account.username} icon={AtSign} />
                  <ProfileItem label='Email' value={account.email} icon={Mail} />
                  <ProfileItem label='Phone Number' value={account.phone} icon={Phone} />
                  <ProfileItem
                    label='Birth Date'
                    value={account.dob ? format(new Date(account.dob), 'MMMM d, yyyy') : undefined}
                    icon={Cake}
                  />
                  <ProfileItem label='Gender' value={account.gender} icon={Users} />
                  <ProfileItem label='Location' value={account.addresses?.[0]?.fullAddress} icon={MapPin} />
                </div>
              </div>

              <Separator className='my-4' />

              <div>
                <h3 className='flex items-center gap-2 text-sm font-semibold mb-3'>
                  <div className='bg-primary/10 text-primary rounded-md p-1.5'>
                    <Shield className='h-4 w-4' />
                  </div>
                  Account Information
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  <ProfileItem label='User Role' value={account.role} icon={Star} />
                  <ProfileItem label='Account Status' value={account.status} icon={Tag} />
                  <ProfileItem
                    label='Created At'
                    value={account.createdAt ? format(new Date(account.createdAt), 'MMMM d, yyyy') : undefined}
                    icon={Calendar}
                  />
                  <ProfileItem
                    label='Last Updated'
                    value={account.updatedAt ? format(new Date(account.updatedAt), 'MMMM d, yyyy') : undefined}
                    icon={Calendar}
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
