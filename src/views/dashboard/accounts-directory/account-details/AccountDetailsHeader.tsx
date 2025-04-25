import 'react-quill-new/dist/quill.bubble.css'

import { format } from 'date-fns'
import { CircleSlash, LucideIcon, Shield } from 'lucide-react'
import * as React from 'react'
import ReactQuill from 'react-quill-new'

import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TUserResponse } from '@/network/apis/user/type'
import { UserRoleEnum, UserStatusEnum } from '@/types/user'

type StatusConfig = {
  label: string
  color: string
  bgColor: string
  Icon?: LucideIcon
}

const statusConfig: Record<string, StatusConfig> = {
  [UserStatusEnum.ACTIVE]: {
    label: 'Active',
    color: 'text-green-700',
    bgColor: 'bg-green-100'
  },
  [UserStatusEnum.INACTIVE]: {
    label: 'Inactive',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100'
  },
  [UserStatusEnum.PENDING]: {
    label: 'Pending',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100'
  },
  [UserStatusEnum.BANNED]: {
    label: 'Banned',
    color: 'text-red-700',
    bgColor: 'bg-red-100'
  }
}

const roleConfig = {
  [UserRoleEnum.ADMIN]: {
    icon: Shield,
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    iconColor: 'text-red-700'
  },
  [UserRoleEnum.CONSULTANT]: {
    icon: Shield,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    iconColor: 'text-blue-700'
  },
  [UserRoleEnum.CUSTOMER]: {
    icon: Shield,
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    iconColor: 'text-green-700'
  },
  [UserRoleEnum.MANAGER]: {
    icon: Shield,
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    iconColor: 'text-purple-700'
  }
}

// Info item component with label and value
const InfoItem = ({ label, value, icon: Icon }: { label: string; value?: string; icon?: LucideIcon }) => (
  <div className='flex items-center gap-2'>
    {Icon && <Icon className='w-4 h-4 text-muted-foreground' />}
    <span className='text-sm text-muted-foreground'>{label}:</span>
    {value ? (
      <span className='text-sm font-medium'>{value}</span>
    ) : (
      <span className='text-sm font-medium flex items-center gap-1 text-muted-foreground'>
        <CircleSlash className='w-3 h-3' />
        <span>N/A</span>
      </span>
    )}
  </div>
)

interface AccountDetailsHeaderProps {
  account?: TUserResponse
  isLoading: boolean
}

const AccountDetailsHeader: React.FC<AccountDetailsHeaderProps> = ({ account, isLoading }) => {
  if (!account && isLoading) {
    return (
      <Card className='h-min flex items-center align-center max-w-full py-8 px-4'>
        <LoadingContentLayer />
      </Card>
    )
  }

  if (!account) {
    return (
      <Card className='h-min flex items-center align-center max-w-full py-8 px-4'>
        <div className='w-full text-center'>Account not found</div>
      </Card>
    )
  }

  const displayName =
    account.firstName || account.lastName
      ? `${account.firstName || ''} ${account.lastName || ''}`.trim()
      : account.username || account.email || 'Unknown User'

  const status = account.status ? String(account.status) : ''
  const statusInfo = statusConfig[status] || {
    label: status,
    color: 'text-gray-700',
    bgColor: 'bg-gray-100'
  }

  // Format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return undefined
    try {
      return format(new Date(dateString), 'yyyy-MM-dd')
    } catch {
      return undefined
    }
  }

  // Get role display text and config
  const getRoleDisplay = () => {
    if (!account) return undefined
    const roleValue = account.role?.role || (typeof account.role === 'string' ? account.role : undefined)
    if (!roleValue) return undefined
    return {
      value: roleValue,
      config: roleConfig[roleValue as keyof typeof roleConfig] || {
        icon: Shield,
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
        iconColor: 'text-gray-700'
      }
    }
  }

  const roleDisplay = getRoleDisplay()
  const Icon = roleDisplay?.config.icon || Shield

  return (
    <Card className='dark:border-zinc-800'>
      <div className='p-4 sm:p-6'>
        <div className='flex flex-col sm:flex-row gap-6 items-start'>
          <Avatar className='min-h-[80px] min-w-[80px] relative'>
            <AvatarImage src={account.avatar || ''} />
            <AvatarFallback className='text-2xl font-bold dark:bg-accent/20'>
              {account.username ? account.username[0].toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>

          <div className='flex-1'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-3 mb-2'>
              <h2 className='text-2xl font-extrabold'>{displayName}</h2>
              <div className='flex items-center gap-2'>
                <Badge className={`${statusInfo.bgColor} ${statusInfo.color} self-start`}>{statusInfo.label}</Badge>
                <span className='text-sm text-muted-foreground'>•</span>
                {roleDisplay && (
                  <Badge
                    variant='outline'
                    className={cn(
                      'flex items-center w-fit gap-1 px-2 py-1 border',
                      roleDisplay.config.bgColor,
                      roleDisplay.config.textColor
                    )}
                  >
                    <Icon className={cn('size-3.5', roleDisplay.config.iconColor)} aria-hidden='true' />
                    <span className='capitalize whitespace-nowrap'>{roleDisplay.value.toLowerCase()}</span>
                  </Badge>
                )}
              </div>
            </div>

            <div className='flex flex-wrap items-center gap-2 mt-2 text-sm'>
              <InfoItem label='Registered on' value={formatDate(account.createdAt)} />
              <span className='text-muted-foreground'>•</span>
              <InfoItem label='Recent activity' value={formatDate(account.updatedAt)} />
              <span className='text-muted-foreground'>•</span>
              <InfoItem label='Account security' value={account.isEmailVerify ? 'Verified' : 'Unverified'} />
            </div>

            {account.majorTitle && (
              <div className='mt-4'>
                <InfoItem label='Major Title' value={account.majorTitle} />
              </div>
            )}

            {account.yoe && (
              <div className='mt-2'>
                <InfoItem label='Years of Experience' value={`${account.yoe} years`} />
              </div>
            )}

            {account.description && (
              <div className='mt-4 prose prose-sm max-w-none [&>.ql-bubble>.ql-editor]:p-0'>
                <ReactQuill value={account.description} readOnly={true} theme='bubble' modules={{ toolbar: false }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default AccountDetailsHeader
