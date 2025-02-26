import { ImageIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusEnum } from '@/types/enum'
import { IImage } from '@/types/image'

interface ProductImageDetailsProps {
  images: IImage[] | undefined | null
}
const ProductImageDetails = ({ images }: ProductImageDetailsProps) => {
  const { t } = useTranslation()
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <ImageIcon className='w-5 h-5' />
          {t('createProduct.productImages')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {images
            ?.filter((img) => img.status === StatusEnum.ACTIVE)
            ?.map((image, index) => (
              <div key={index} className='relative aspect-square rounded-lg overflow-hidden'>
                <img
                  src={image.fileUrl || '/api/placeholder/200/200'}
                  alt={`${index + 1}`}
                  className='object-cover w-full h-full'
                />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductImageDetails
