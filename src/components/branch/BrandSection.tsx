import { useTranslation } from 'react-i18next'

import State from '@/components/state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Ratings } from '@/components/ui/rating'
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
            <div className='flex flex-col gap-1'>
              <div className='flex gap-2 items-start'>
                <div className='flex flex-col'>
                  <span className='text-xl font-bold'>{brand.name}</span>
                  <Ratings rating={brand.star ?? 0} size={13} variant='yellow' />
                </div>
                <State state={brand.status} />
              </div>
              <p className='text-sm text-gray-500'>
                {t('brand.establishmentDate')}:{' '}
                {t('date.toLocaleDateString', { val: new Date(brand.establishmentDate) })}
              </p>
            </div>
          </div>
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
          <p className='font-medium'>{brand.address}</p>
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
