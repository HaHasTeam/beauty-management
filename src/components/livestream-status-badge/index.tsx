import { useTranslation } from 'react-i18next'

import { LiveStreamEnum } from '@/types/enum'

import { Badge } from '../ui/badge'

interface Props {
  status: LiveStreamEnum
}
interface StatusProps {
  label: string
  variant: 'outline' | 'destructive' | 'secondary' | 'default' | undefined | null
}

export const LivestreamStatusBadge = ({ status }: Props) => {
  const { t } = useTranslation()
  const statusMap = {
    [LiveStreamEnum.SCHEDULED]: { label: t('livestream.Scheduled'), variant: 'outline' },
    [LiveStreamEnum.LIVE]: { label: t('livestream.Live'), variant: 'destructive' },
    [LiveStreamEnum.ENDED]: { label: t('livestream.Ended'), variant: 'secondary' },
    [LiveStreamEnum.CANCELLED]: { label: t('livestream.Cancelled'), variant: 'destructive' }
  }

  const { label, variant }: StatusProps =
    (statusMap[status] as StatusProps) || ({ label: status, variant: 'outline' } as StatusProps)

  return <Badge variant={variant}>{label}</Badge>
}
