import { useTranslation } from 'react-i18next'

import { GroupBuyingStatusEnum } from '@/types/group-buying'

import { Badge } from '../ui/badge'

interface Props {
  status: GroupBuyingStatusEnum
}
interface StatusProps {
  label: string
  variant: 'outline' | 'destructive' | 'secondary' | 'default' | undefined | null
  className: string
}

export const GroupBuyingStatusBadge = ({ status }: Props) => {
  const { t } = useTranslation()
  const statusMap = {
    [GroupBuyingStatusEnum.ACTIVE]: {
      label: t('status.ACTIVE'),
      variant: 'default',
      className: 'bg-green-200 border-green-500 text-green-500 hover:text-green-500 hover:bg-green-300'
    },
    [GroupBuyingStatusEnum.INACTIVE]: {
      label: t('status.INACTIVE'),
      variant: 'default',
      className: 'bg-gray-300 border-gray-500 text-gray-500 hover:text-gray-500 hover:bg-gray-400'
    }
  }

  const { label, variant, className }: StatusProps =
    (statusMap[status] as StatusProps) || ({ label: status, variant: 'outline', className: '' } as StatusProps)

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  )
}
