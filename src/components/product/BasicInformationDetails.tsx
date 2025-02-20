import './index.css'

import { FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ReactQuill from 'react-quill-new'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusEnum } from '@/types/enum'
import { IResponseProduct } from '@/types/product'

interface BasicInformationDetailsProps {
  product: IResponseProduct
}
const BasicInformationDetails = ({ product }: BasicInformationDetailsProps) => {
  const { t } = useTranslation()
  return (
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <FileText className='w-5 h-5' />
          {t('createProduct.basicInformation')}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='space-y-3'>
          {/* <div>
            <p className='text-sm text-gray-500'>{t('createProduct.productId')}</p>
            <p className='font-medium'>{product.id}</p>
          </div> */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-gray-500'>{t('createProduct.sku')}</p>
              <p className='font-medium'>{product.sku}</p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>{t('createProduct.category')}</p>
              <p className='font-medium'>{product.category?.name}</p>
            </div>
          </div>
          <div>
            <p className='text-sm text-gray-500'>{t('createProduct.productImages')}</p>
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4'>
              {product.images
                ?.filter((img) => img.status === StatusEnum.ACTIVE)
                ?.map((image, index) => (
                  <div key={index} className='relative aspect-square w-32 h-32 rounded-lg overflow-hidden'>
                    <img
                      src={image.fileUrl || '/api/placeholder/200/200'}
                      alt={`${index + 1}`}
                      className='object-cover w-full h-full'
                    />
                  </div>
                ))}
            </div>
          </div>
          {/* <div>
            <p className='text-sm text-gray-500'>{t('createProduct.createdAt')}</p>
            <p className='font-medium'>{t('date.toLocaleDateString', { val: new Date(product.createdAt) })}</p>
          </div> */}
        </div>
        <div>
          <p className='text-sm text-gray-500'>{t('createProduct.description')}</p>
          <ReactQuill value={product?.description} readOnly={true} theme={'bubble'} />
        </div>
      </CardContent>
    </Card>
  )
}

export default BasicInformationDetails
