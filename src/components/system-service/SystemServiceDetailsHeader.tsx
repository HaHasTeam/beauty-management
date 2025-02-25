import { ChevronLeft, Clock, Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Routes, routesConfig } from '@/configs/routes'
import { IResponseSystemService } from '@/types/system-service'

interface SystemServiceDetailsHeaderProps {
  serviceData: IResponseSystemService
}
const SystemServiceDetailsHeader = ({ serviceData }: SystemServiceDetailsHeaderProps) => {
  const { t } = useTranslation()
  return (
    <div className='space-y-2'>
      <div className='flex md:justify-between md:items-center md:flex-row flex-col items-start gap-1'>
        <div className='space-y-1'>
          <h1 className='text-xl font-bold text-gray-800'>{serviceData.name}</h1>
        </div>
        <div className='flex space-x-2'>
          <Link to={routesConfig[Routes.UPDATE_SYSTEM_SERVICE].getPath({ id: serviceData.id })}>
            <div className='bg-primary md:text-base sm:text-sm text-xs min-w-fit px-2 py-1 rounded-md text-white hover:text-white flex items-center gap-1 hover:bg-primary/80 border border-primary'>
              {t('button.edit')}
              <Pencil className='w-5 h-5 sm:block hidden' />
            </div>
          </Link>
          <Link
            to={routesConfig[Routes.SYSTEM_SERVICE_LIST].getPath()}
            className='md:text-base sm:text-sm text-xs min-w-fit px-2 py-1 rounded-md text-primary hover:text-primary flex items-center gap-1 bg-white hover:bg-primary/10 border border-primary'
          >
            <ChevronLeft className='w-5 h-5 sm:block hidden' />
            {t('button.backToList')}
          </Link>
        </div>
      </div>
      <div className='text-base flex md:justify-between md:items-center md:flex-row flex-col justify-start items-start w-full text-muted-foreground'>
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
