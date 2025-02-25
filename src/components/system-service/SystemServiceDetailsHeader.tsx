import { Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { IResponseSystemService } from '@/types/system-service'

import { Button } from '../ui/button'

interface SystemServiceDetailsHeaderProps {
  serviceData: IResponseSystemService
}
const SystemServiceDetailsHeader = ({ serviceData }: SystemServiceDetailsHeaderProps) => {
  const { t } = useTranslation()
  return (
    <div className='space-y-2'>
      <div className='flex justify-between items-center'>
        <div className='space-y-1'>
          <h1 className='text-xl font-bold text-gray-800'>{serviceData.name}</h1>
        </div>
        <div className='flex space-x-2'>
          <Button>{t('button.edit')}</Button>
          <Button className='hover:bg-primary/10 text-primary hover:text-primary border-primary' variant='outline'>
            {t('button.backToList')}
          </Button>
        </div>
      </div>
      <div className='text-base flex justify-between items-center w-full text-muted-foreground'>
        <div className='flex items-center gap-1'>
          <Clock size={14} className='text-gray-400' />
          <span className='text-muted-foreground'>{t('systemService.createdAt')}:</span>
          <span className='font-medium'>
            {t('date.toLocaleDateTimeString', { val: new Date(serviceData.createdAt) })}
          </span>
        </div>
        <div className='flex items-center gap-1'>
          <Clock size={14} className='text-gray-400' />
          <span className='text-muted-foreground'>{t('systemService.lastUpdated')}:</span>
          <span className='font-medium'>
            {t('date.toLocaleDateTimeString', { val: new Date(serviceData.updatedAt) })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default SystemServiceDetailsHeader
