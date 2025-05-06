import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Calendar, Clock, ExternalLink, Package, Tag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import Button from '@/components/button'
import Empty from '@/components/empty/Empty'
import ImageWithFallback from '@/components/image/ImageWithFallback'
import { LivestreamStatusBadge } from '@/components/livestream-status-badge'
import LoadingLayer from '@/components/loading-icon/LoadingLayer'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Routes, routesConfig } from '@/configs/routes'
import { getLivestreamByIdApi } from '@/network/apis/live-stream'
import { ILivestream } from '@/types/livestream'
import { calculateDiscountPrice } from '@/utils/price'

const Details = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const { data: livestreamData, isFetching } = useQuery({
    queryKey: [getLivestreamByIdApi.queryKey, id as string],
    queryFn: getLivestreamByIdApi.fn,
    enabled: !!id
  })
  const livestream: ILivestream = livestreamData?.data as ILivestream

  return (
    <div className='space-y-3 w-full'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='icon' asChild>
            <Link to={routesConfig[Routes.LIVESTREAM].path}>
              <ArrowLeft className='h-4 w-4' />
            </Link>
          </Button>
          <h1 className='text-2xl font-bold'>{t('livestream.detail.title')}</h1>
        </div>
      </div>

      {isFetching && <LoadingLayer />}

      {!isFetching && (!livestreamData || !livestreamData?.data) && (
        <Empty
          title={t('empty.livestreamDetail.title')}
          description={t('empty.livestreamDetail.description')}
          link={routesConfig[Routes.LIVESTREAM].path}
          linkText={t('empty.livestreamDetail.button')}
        />
      )}

      {!isFetching && livestream && (
        <div className='w-full space-y-6'>
          {/* Main livestream info */}
          <Card>
            <CardHeader>
              <CardTitle className='flex justify-between items-center'>
                <span>{livestream.title}</span>
                <LivestreamStatusBadge status={livestream.status} />
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='aspect-video relative rounded-md overflow-hidden'>
                {livestream.thumbnail && (
                  <img
                    src={livestream.thumbnail || '/placeholder.svg'}
                    alt={livestream.title}
                    className='object-cover w-full h-full'
                  />
                )}
                {!livestream.thumbnail && (
                  <div className='w-full h-full bg-muted flex items-center justify-center'>
                    <span className='text-muted-foreground'>No thumbnail</span>
                  </div>
                )}
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>{t('livestream.detail.startTime')}</p>
                    <p className='text-sm text-muted-foreground'>
                      {t('date.toLocaleDateTimeString', { val: new Date(livestream.startTime) })}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Clock className='h-4 w-4 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>{t('livestream.detail.endTime')}</p>
                    <p className='text-sm text-muted-foreground'>
                      {livestream.endTime
                        ? t('date.toLocaleDateTimeString', { val: new Date(livestream.endTime) })
                        : t('livestream.detail.notEnded')}
                    </p>
                  </div>
                </div>
              </div>

              {livestream.record && (
                <div>
                  <h3 className='text-sm font-medium mb-2'>{t('livestream.detail.recording')}</h3>
                  <Button variant='outline' size='sm' className='gap-2' asChild>
                    <a href={livestream.record} target='_blank' rel='noopener noreferrer'>
                      <ExternalLink className='h-4 w-4' />
                      {t('livestream.detail.viewRecording')}
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Streamer info */}
          <Card>
            <CardHeader>
              <CardTitle>{t('livestream.detail.streamerInfo')}</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center gap-3'>
                <Avatar className='h-10 w-10'>
                  <AvatarImage src={livestream.account.avatar || ''} alt={livestream.account.username} />
                  <AvatarFallback>{livestream.account.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-medium'>{livestream.account.username}</p>
                  <p className='text-sm text-muted-foreground'>{livestream.account.email}</p>
                </div>
              </div>

              <Separator />

              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-sm text-muted-foreground'>{t('livestream.detail.phone')}</span>
                  <span className='text-sm'>{livestream.account.phone || '-'}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-muted-foreground'>{t('livestream.detail.status')}</span>
                  <Badge variant={livestream.account.status === 'ACTIVE' ? 'outline' : 'secondary'}>
                    {livestream.account.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products section */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Package className='h-5 w-5' />
                {t('livestream.detail.products')} ({livestream.livestreamProducts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('livestream.detail.product')}</TableHead>
                    <TableHead>{t('livestream.detail.sku')}</TableHead>
                    <TableHead className='text-right'>{t('livestream.detail.price')}</TableHead>
                    <TableHead className='text-right'>{t('livestream.detail.discount')}</TableHead>
                    <TableHead className='text-right'>{t('livestream.detail.finalPrice')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {livestream.livestreamProducts.map((item) => {
                    const product = item.product
                    const defaultClassification =
                      product &&
                      product.productClassifications &&
                      (product.productClassifications.find((c) => c.type === 'DEFAULT') ||
                        product.productClassifications[0])
                    const price = defaultClassification?.price || 0
                    const discountPercent = item.discount * 100
                    const finalPrice = calculateDiscountPrice(price, item.discount)

                    return (
                      <TableRow key={item.id}>
                        <TableCell className='font-medium'>
                          <Link to={routesConfig[Routes.PRODUCT_DETAILS].getPath({ id: product.id })}>
                            <div className='flex items-center gap-3'>
                              <div className='h-10 w-10 rounded-md overflow-hidden bg-muted flex-shrink-0'>
                                {product.images && product.images[0] ? (
                                  <ImageWithFallback
                                    src={product.images[0].fileUrl || '/placeholder.svg'}
                                    alt={product.name}
                                    className='h-full w-full object-cover'
                                    fallback={fallBackImage}
                                  />
                                ) : (
                                  <div className='h-full w-full flex items-center justify-center'>
                                    <Package className='h-5 w-5 text-muted-foreground' />
                                  </div>
                                )}
                              </div>
                              <span className='line-clamp-2 overflow-ellipsis'>{product.name}</span>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell className='text-right'>{t('productCard.price', { price: price })}</TableCell>
                        <TableCell className='text-right'>
                          <Badge variant='outline' className='gap-1 font-normal'>
                            <Tag className='h-3 w-3' />
                            {discountPercent}%
                          </Badge>
                        </TableCell>
                        <TableCell className='text-right font-medium w-fit'>
                          {t('productCard.price', { price: finalPrice })}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {livestream.livestreamProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className='text-center py-6 text-muted-foreground'>
                        {t('livestream.detail.noProducts')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Details
