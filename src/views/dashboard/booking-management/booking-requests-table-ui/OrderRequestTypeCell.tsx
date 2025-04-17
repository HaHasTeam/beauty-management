import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { TOrderRequest } from '@/types/order-request'

interface OrderRequestTypeCellProps {
  request: TOrderRequest
}

export function OrderRequestTypeCell({ request }: OrderRequestTypeCellProps) {
  const { t } = useTranslation()

  const getTypeVariant = (type: TOrderRequest['type']) => {
    switch (type) {
      case 'CANCEL':
        return 'destructive'
      case 'REFUND':
        return 'secondary'
      case 'REJECT_REFUND':
        return 'default'
      case 'COMPLAINT':
        return 'outline'
      default:
        return 'default'
    }
  }

  return (
    <Badge variant={getTypeVariant(request.type)} className='text-nowrap'>
      {t(
        `order.request.type.${request.type.toLowerCase()}`,
        {
          CANCEL: 'Cancel',
          REFUND: 'Refund',
          REJECT_REFUND: 'Reject Refund',
          COMPLAINT: 'Complaint'
        }[request.type]
      )}
    </Badge>
  )
}
