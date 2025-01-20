import { MessageSquare, Store } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import Button from '@/components/button'
import { Routes, routesConfig } from '@/configs/routes'

interface BrandOrderInformationProps {
  brandName: string
  brandId: string
}

const BrandOrderInformation = ({ brandName, brandId }: BrandOrderInformationProps) => {
  const { t } = useTranslation()
  return (
    <div className='space-y-2 bg-white shadow-sm w-full p-4 rounded-lg'>
      <div className='flex sm:flex-row flex-col gap-2'>
        <Link to={routesConfig[Routes.BRAND].path + '/' + brandId} className='text-xl font-bold'>
          {brandName}
        </Link>
        <div className='flex gap-2 w-full md:w-auto'>
          <Button className='sm:gap-2 gap-1 flex-1 md:flex-none bg-primary hover:bg-primary/80 px-2 sm:px-3' size='sm'>
            <MessageSquare className='w-4 h-4 sm:mr-2 mr-1' />
            {t('brand.chatNow')}
          </Button>
          <Link
            to={routesConfig[Routes.BRAND].path + '/' + brandId}
            className='sm:gap-2 gap-1 px-2 rounded-md flex items-center flex-1 md:flex-none border border-primary text-primary hover:text-primary hover:bg-primary/10 text-sm'
          >
            <Store className='w-4 h-4 sm:mr-2 mr-1' />
            {t('brand.viewShop')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BrandOrderInformation
