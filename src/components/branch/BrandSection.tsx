import { MessageSquare, Store } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import Button from '@/components/button'
import State from '@/components/state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Ratings } from '@/components/ui/rating'
import { Routes, routesConfig } from '@/configs/routes'
import { IBrand } from '@/types/brand'

interface BrandSectionProps {
  brand: IBrand | null
}

const BrandSection = ({ brand }: BrandSectionProps) => {
  const { t } = useTranslation()
  if (!brand) return null
  return (
    <div className='space-y-2 bg-white shadow-sm w-full p-4 rounded-lg'>
      <div className='md:flex block items-center justify-between'>
        <div>
          <div className='flex gap-2'>
            {brand.logo && (
              <Avatar>
                <AvatarImage src={brand.logo} alt={brand.name} />
                <AvatarFallback>{brand.name?.charAt(0).toUpperCase() ?? 'A'}</AvatarFallback>
              </Avatar>
            )}
            <div className='md:flex block gap-1 md:gap-2 items-center'>
              <div className='flex gap-2 items-center'>
                <Link to={routesConfig[Routes.BRAND].path + '/' + brand.id} className='text-xl font-bold'>
                  {brand.name}
                </Link>
                <State state={brand.status} />
              </div>
              <Ratings rating={brand.star} size={13} variant='yellow' />
            </div>
          </div>
          <p className='text-sm text-gray-500'>
            {t('brand.establishmentDate')}: {t('date.toLocaleDateString', { val: new Date(brand.establishmentDate) })}
          </p>
        </div>
        <div className='flex gap-2 w-full md:w-auto'>
          <Button className='sm:gap-2 gap-1 flex-1 md:flex-none bg-primary hover:bg-primary/80 px-2 sm:px-3' size='sm'>
            <MessageSquare className='w-4 h-4 sm:mr-2 mr-1 sm:inline hidden' />
            <span>{t('brand.chatNow')}</span>
          </Button>
          <Link
            to={routesConfig[Routes.BRAND].path + '/' + brand.id}
            className='sm:gap-2 gap-1 px-2 rounded-md flex items-center flex-1 md:flex-none border border-primary text-primary hover:text-primary hover:bg-primary/10 text-sm'
          >
            <Store className='w-4 h-4 sm:mr-2 mr-1 sm:inline hidden' />
            <span>{t('brand.viewShop')}</span>
          </Link>
        </div>
      </div>
      <div className='grid sm:grid-cols-4 grids-cols-2 gap-4'>
        <div>
          <p className='text-sm text-gray-500'>{t('address.email')}</p>
          <p className='font-medium overflow-clip'>{brand.email}</p>
        </div>
        <div>
          <p className='text-sm text-gray-500'>{t('address.phone')}</p>
          <p className='font-medium'>{brand.phone}</p>
        </div>
        <div>
          <p className='text-sm text-gray-500'>{t('address.title')}</p>
          <p className='font-medium'>{[brand.address, brand.ward, brand.district, brand.province].join(', ')}</p>
        </div>
        <div>
          <p className='text-sm text-gray-500'>{t('brand.businessTaxCode')}</p>
          <p className='font-medium'>{brand.businessTaxCode}</p>
        </div>
      </div>
    </div>
  )
}

export default BrandSection
