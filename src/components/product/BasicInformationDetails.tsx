import './index.css'

import { Download, Eye, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ReactQuill from 'react-quill-new'

import { ICategory } from '@/types/category'
import { StatusEnum } from '@/types/enum'
import { IResponseProduct } from '@/types/product'
import { handleDownload } from '@/utils/certificate/handleDownload'
import { handleView } from '@/utils/certificate/handleView'

interface BasicInformationDetailsProps {
  product: IResponseProduct
}
const BasicInformationDetails = ({ product }: BasicInformationDetailsProps) => {
  const { t } = useTranslation()
  const buildCategoryPath = (category: ICategory): string => {
    // If level is 1, just return the name
    if (category.level === 1) {
      return category.name
    }

    const parts: string[] = [category.name]
    let currentCategory: ICategory | null | undefined = category

    // Traverse up through parent categories until we reach level 1
    while (currentCategory?.parentCategory) {
      parts.unshift(currentCategory.parentCategory.name)
      currentCategory = currentCategory.parentCategory
    }

    // Join all parts with " > "
    return parts.join(' > ')
  }

  return (
    <div className='space-y-3'>
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
            <p className='font-medium'>{product.category && buildCategoryPath(product.category)}</p>
          </div>
          <div>
            <p className='text-sm text-gray-500'>{t('createProduct.createdAt')}</p>
            <p className='font-medium'>{t('date.toLocaleDateString', { val: new Date(product.createdAt) })}</p>
          </div>
          <div>
            <p className='text-sm text-gray-500'>{t('order.lastUpdated')}</p>
            {product.updatedAt && (
              <p className='font-medium'>{t('date.toLocaleDateString', { val: new Date(product.updatedAt) })}</p>
            )}
          </div>
        </div>
        <div className='space-y-1'>
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
        <div className='space-y-1'>
          <p className='text-sm text-gray-500'>{t('createProduct.certificate')}</p>
          {product.certificates && product.certificates.length > 0 ? (
            <div className='space-y-2'>
              {product.certificates.map((certificate, index) => (
                <div
                  key={index}
                  className='flex items-center gap-4 p-3 rounded-lg border border-primary/40 hover:bg-primary/10'
                >
                  <FileText className='h-5 w-5 text-primary' />
                  <span className='flex-1 text-sm overflow-ellipsis line-clamp-2'>
                    {product.certificates.length > 1
                      ? `${t('createProduct.certificate')} (${index + 1})`
                      : t('createProduct.certificate')}
                  </span>
                  <button
                    onClick={() => handleView(certificate)}
                    className='flex items-center gap-2 text-gray-500 hover:text-gray-800'
                    title='View'
                  >
                    <Eye className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() =>
                      handleDownload(
                        certificate,
                        product.certificates.length > 1 ? `${product.name} (${index + 1})` : product.name
                      )
                    }
                    className='flex items-center gap-2 text-gray-500 hover:text-gray-800'
                    title='Download'
                  >
                    <Download className='h-4 w-4' />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className='font-medium'>{t('createProduct.noCertificates')}</p>
          )}
        </div>
      </div>
      <div className='space-y-1'>
        <p className='text-sm text-gray-500'>{t('createProduct.description')}</p>
        <ReactQuill value={product?.description} readOnly={true} theme={'bubble'} />
      </div>
    </div>
  )
}

export default BasicInformationDetails
