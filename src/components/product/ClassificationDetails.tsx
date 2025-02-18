import { Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import State from '@/components/state'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusEnum } from '@/types/brand'
import { IClassification } from '@/types/classification'
import { IImage } from '@/types/image'

interface ClassificationDetailsProps {
  classifications: IClassification[]
}
const ClassificationDetails = ({ classifications }: ClassificationDetailsProps) => {
  const { t } = useTranslation()
  return (
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Package className='w-5 h-5' />
          {t('createProduct.classificationInformation')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <Table className='w-full hover:bg-transparent items-center'>
            <TableHeader>
              <TableRow>
                <TableHead>{t('productDetail.images')}</TableHead>
                <TableHead>{t('productDetail.name')}</TableHead>
                <TableHead>{t('cart.price')}</TableHead>
                <TableHead>{t('productDetail.quantity')}</TableHead>
                <TableHead>{t('createProduct.sku')}</TableHead>
                <TableHead>{t('orderDetail.status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classifications.map((variant, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className='grid sm:grid-cols-2 grid-cols-1 gap-1'>
                      {variant.images.map((image: IImage) => (
                        <img src={image.fileUrl} alt={variant.title} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{variant.title}</TableCell>
                  <TableCell>{t('productCard.price', { price: variant.price })}</TableCell>
                  <TableCell>{variant.quantity}</TableCell>
                  <TableCell>{variant.sku}</TableCell>
                  <TableCell>
                    <State state={variant.status ?? StatusEnum.INACTIVE} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default ClassificationDetails
