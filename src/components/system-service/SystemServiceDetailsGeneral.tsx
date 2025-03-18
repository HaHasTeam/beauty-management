import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ReactQuill from 'react-quill-new'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import { StatusEnum } from '@/types/enum'
import { IResponseSystemService } from '@/types/system-service'

import ImageWithFallback from '../image/ImageWithFallback'
import SystemServiceTypeTag from './SystemServiceTypeTag'

interface SystemServiceDetailsGeneralProps {
  serviceData: IResponseSystemService
}
const SystemServiceDetailsGeneral = ({ serviceData }: SystemServiceDetailsGeneralProps) => {
  const { t } = useTranslation()

  const activeImage = useMemo(
    () => serviceData.images.filter((img) => img.status === StatusEnum.ACTIVE)?.[0],
    [serviceData.images]
  )
  return (
    <div className='space-y-3'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        <div>
          <h4 className='text-sm font-medium text-gray-500 mb-1'>{t('systemService.type')}</h4>
          <div className='flex items-center'>
            <SystemServiceTypeTag type={serviceData.type} />
          </div>
        </div>
        <div>
          <h4 className='text-sm font-medium text-gray-500 mb-1'>{t('systemService.category')}</h4>
          <div className='flex items-center'>
            <span>{serviceData.category.name}</span>
          </div>
        </div>
      </div>
      <div>
        <h4 className='text-sm font-medium text-gray-500 mb-1'>{t('systemService.serviceImages')}</h4>
        <div className='h-32 w-40 rounded-md'>
          <ImageWithFallback
            src={activeImage.fileUrl}
            alt={activeImage.id}
            fallback={fallBackImage}
            className='object-cover w-full h-full rounded-md'
          />
        </div>
      </div>
      <div>
        <h4 className='text-sm font-medium text-gray-500 mb-1'>{t('systemService.description')}</h4>
        {/* <p className='text-gray-900'>{serviceData.description}</p> */}
        <ReactQuill value={serviceData.description} readOnly={true} theme={'bubble'} />
      </div>
    </div>
  )
}

export default SystemServiceDetailsGeneral
