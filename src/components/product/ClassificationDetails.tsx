import { useTranslation } from 'react-i18next'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import State from '@/components/state'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusEnum } from '@/types/brand'
import { ClassificationTypeEnum } from '@/types/enum'
import { IImage } from '@/types/image'
import { IServerProductClassification } from '@/types/product'

import ImageWithFallback from '../image/ImageWithFallback'

interface ClassificationDetailsProps {
  classifications: IServerProductClassification[]
}
const ClassificationDetails = ({ classifications }: ClassificationDetailsProps) => {
  const { t } = useTranslation()
  // Check if there are any CUSTOM and ACTIVE classifications
  const hasCustomActive = classifications.some(
    (classification) =>
      classification.type === ClassificationTypeEnum.CUSTOM && classification.status === StatusEnum.ACTIVE
  )

  // If there are CUSTOM & ACTIVE classifications, show the table
  if (hasCustomActive) {
    const customClassifications = classifications.filter(
      (classification) =>
        classification.type === ClassificationTypeEnum.CUSTOM && classification.status === StatusEnum.ACTIVE
    )
    // Check if any classification has these fields
    const hasColor = customClassifications.some((c) => c.color)
    const hasSize = customClassifications.some((c) => c.size)
    const hasOther = customClassifications.some((c) => c.other)
    return (
      <div className='overflow-x-auto'>
        <Table className='w-full hover:bg-transparent items-center'>
          <TableHeader>
            <TableRow>
              <TableHead>{t('createProduct.sku')}</TableHead>
              <TableHead>
                <div className='flex justify-center'>{t('productDetail.images')}</div>
              </TableHead>
              {hasColor && <TableHead>{t('createProduct.color')}</TableHead>}
              {hasSize && <TableHead>{t('createProduct.size')}</TableHead>}
              {hasOther && <TableHead>{t('createProduct.other')}</TableHead>}
              <TableHead>
                <div className='flex justify-end'>{t('cart.price')}</div>
              </TableHead>
              <TableHead>
                <div className='flex justify-end'>{t('productDetail.quantity')}</div>
              </TableHead>
              <TableHead>
                <div className='flex justify-center'>{t('orderDetail.status')}</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customClassifications.map((variant, index) => (
              <TableRow key={index}>
                <TableCell>{variant.sku === '' ? '-' : variant.sku}</TableCell>
                <TableCell>
                  <div
                    className={`grid ${variant.images.length > 1 && 'sm:grid-cols-2'} grid-cols-1 gap-1 place-items-center`}
                  >
                    {variant.images.map((image: IImage) => (
                      <div key={image.id} className='relative aspect-square w-32 h-32 rounded-lg overflow-hidden'>
                        <ImageWithFallback
                          fallback={fallBackImage}
                          className='object-cover w-full h-full'
                          src={image.fileUrl}
                          alt={variant.title}
                        />
                      </div>
                    ))}
                  </div>
                </TableCell>
                {hasColor && <TableCell>{variant.color}</TableCell>}
                {hasSize && <TableCell>{variant.size}</TableCell>}
                {hasOther && <TableCell>{variant.other}</TableCell>}
                <TableCell>
                  <div className='flex justify-end'>{t('productCard.price', { price: variant.price })}</div>
                </TableCell>
                <TableCell>
                  <div className='flex justify-end'>{variant.quantity}</div>
                </TableCell>
                <TableCell>
                  <div className='flex justify-center'>
                    <State state={variant.status ?? StatusEnum.INACTIVE} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
  // Find default active classification
  const defaultActive = classifications.find(
    (classification) =>
      classification.type === ClassificationTypeEnum.DEFAULT && classification.status === StatusEnum.ACTIVE
  )

  // If there's a default active classification, show price and quantity
  if (defaultActive) {
    return (
      <div>
        <div>
          <p className='text-sm text-gray-500'>{t('createProduct.price')}</p>
          <p className='font-medium'>{t('productCard.price', { price: defaultActive.price })}</p>
        </div>
        <div>
          <p className='text-sm text-gray-500'>{t('createProduct.quantity')}</p>
          <p className='font-medium'>{defaultActive.quantity}</p>
        </div>
      </div>
    )
  }

  // If no valid classifications found
  return null
}

export default ClassificationDetails
