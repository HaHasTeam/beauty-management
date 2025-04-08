import { useTranslation } from 'react-i18next'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TOrderRequest } from '@/types/order-request'

interface OrderRequestMakerCellProps {
  request: TOrderRequest
}

export function OrderRequestMakerCell({ request }: OrderRequestMakerCellProps) {
  const { t } = useTranslation()

  const isAccountType = request.type === 'CANCEL' || request.type === 'REFUND'
  const maker = isAccountType ? request.order?.account : request.order?.account

  if (!maker) {
    return <span className='text-muted-foreground'>{t('order.request.unknownMaker', 'Unknown')}</span>
  }

  let name = t('order.request.unknownMaker', 'Unknown')
  let avatarUrl = ''

  if (isAccountType) {
    // Handle account type
    if (maker.username) {
      name = maker.username
    } else if (maker.firstName || maker.lastName) {
      name = `${maker.firstName || ''} ${maker.lastName || ''}`.trim()
    } else if (maker.email) {
      name = maker.email
    }
    avatarUrl = maker.avatar || ''
  } else {
    // Handle brand type
    name = maker.username || t('order.request.unknownBrand', 'Unknown Brand')
    avatarUrl = maker.avatar || ''
  }

  const initial = name ? name.charAt(0).toUpperCase() : '?'

  return (
    <div className='flex gap-1 items-center'>
      <Avatar className='rounded-full'>
        <AvatarImage src={avatarUrl} className='size-5' />
        <AvatarFallback>{initial}</AvatarFallback>
      </Avatar>
      <span className='max-w-[31.25rem] truncate'>{name}</span>
    </div>
  )
}
