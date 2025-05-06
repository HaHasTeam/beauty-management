import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Calendar, Clock, Package, Percent, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import Button from '@/components/button'
import Empty from '@/components/empty/Empty'
import { GroupBuyingStatusBadge } from '@/components/group-buying-status-badge'
import ImageWithFallback from '@/components/image/ImageWithFallback'
import LoadingLayer from '@/components/loading-icon/LoadingLayer'
import ProductState from '@/components/product-state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Routes, routesConfig } from '@/configs/routes'
import { cn } from '@/lib/utils'
import { getGroupBuyingByIdApi } from '@/network/apis/group-buying'
import { TGroupBuying } from '@/types/group-buying'
import { UserStatusEnum } from '@/types/user'

import { getStatusIcon } from '../accounts-directory/account-table-ui/helper'

const Details = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const { data: groupBuyingData, isFetching } = useQuery({
    queryKey: [getGroupBuyingByIdApi.queryKey, id as string],
    queryFn: getGroupBuyingByIdApi.fn,
    enabled: !!id
  })
  const groupBuying: TGroupBuying = groupBuyingData?.data as TGroupBuying
  const statusKey = Object.keys(UserStatusEnum).find((status) => {
    const value = UserStatusEnum[status as keyof typeof UserStatusEnum]
    return value === groupBuying?.creator?.status
  })

  if (!statusKey) return null

  const statusValue = UserStatusEnum[statusKey as keyof typeof UserStatusEnum]
  const Icon = getStatusIcon(statusValue)
  return (
    <div className='space-y-3 w-full'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='icon' asChild>
            <Link to={routesConfig[Routes.LIVESTREAM].path}>
              <ArrowLeft className='h-4 w-4' />
            </Link>
          </Button>
          <h1 className='text-2xl font-bold'>{t('groupBuying.detail.title')}</h1>
        </div>
      </div>

      {isFetching && <LoadingLayer />}

      {!isFetching && (!groupBuyingData || !groupBuyingData?.data) && (
        <Empty
          title={t('empty.groupBuyingDetail.title')}
          description={t('empty.groupBuyingDetail.description')}
          link={routesConfig[Routes.GROUP_BUYING].path}
          linkText={t('empty.groupBuyingDetail.button')}
        />
      )}

      {!isFetching && groupBuying && (
        <div className='w-full space-y-6'>
          {/* Main group buying info */}
          <Card>
            <CardHeader>
              <CardTitle className='flex justify-between items-center'>
                <span>{groupBuying.groupProduct.name}</span>
                <GroupBuyingStatusBadge status={groupBuying.status} />
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='flex items-center gap-2'>
                  <Clock className='h-4 w-4 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>{t('groupBuying.detail.endTime')}</p>
                    <p className='text-sm text-muted-foreground'>
                      {t('date.toLocaleDateTimeString', { val: new Date(groupBuying.endTime) })}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>{t('groupBuying.detail.createdAt')}</p>
                    <p className='text-sm text-muted-foreground'>
                      {t('date.toLocaleDateTimeString', { val: new Date(groupBuying.createdAt) })}
                    </p>
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <Users className='h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>{t('groupBuying.detail.maxBuyAmount')}</p>
                  <p className='text-sm text-muted-foreground'>
                    {groupBuying.groupProduct.maxBuyAmountEachPerson} {t('groupBuying.detail.itemsPerPerson')}
                  </p>
                </div>
              </div>

              {groupBuying.groupProduct.description && (
                <div>
                  <h3 className='text-sm font-medium mb-2'>{t('groupBuying.detail.description')}</h3>
                  <p className='text-sm text-muted-foreground'>{groupBuying.groupProduct.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Creator info */}
          <Card>
            <CardHeader>
              <CardTitle>{t('groupBuying.detail.creatorInfo')}</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center gap-3'>
                <Avatar className='h-10 w-10'>
                  <AvatarImage src={groupBuying.creator.avatar || ''} alt={groupBuying.creator.username} />
                  <AvatarFallback>{groupBuying.creator.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-medium'>
                    {groupBuying.creator.firstName} {groupBuying.creator.lastName}
                  </p>
                  <p className='text-sm text-muted-foreground'>{groupBuying.creator.email}</p>
                </div>
              </div>

              <Separator />

              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-sm text-muted-foreground'>{t('groupBuying.detail.username')}</span>
                  <span className='text-sm'>{groupBuying.creator.username}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-muted-foreground'>{t('groupBuying.detail.phone')}</span>
                  <span className='text-sm'>{groupBuying.creator.phone || '-'}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-muted-foreground'>{t('groupBuying.detail.gender')}</span>
                  <span className='text-sm'>{groupBuying.creator.gender || '-'}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-muted-foreground'>{t('groupBuying.detail.status')}</span>
                  <Badge
                    variant='outline'
                    className={cn('flex items-center w-fit gap-1 px-2 py-1 border', Icon.bgColor, Icon.textColor)}
                  >
                    <Icon.icon className={cn('size-3.5', Icon.iconColor)} aria-hidden='true' />
                    <span className='capitalize whitespace-nowrap'>{statusValue.toLowerCase()}</span>
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Discount criteria section */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Percent className='h-5 w-5' />
                {t('groupBuying.detail.discountCriteria')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('groupBuying.detail.peopleThreshold')}</TableHead>
                    <TableHead>{t('groupBuying.detail.voucherCode')}</TableHead>
                    <TableHead>{t('groupBuying.detail.discountType')}</TableHead>
                    <TableHead className='text-right'>{t('groupBuying.detail.discountValue')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupBuying.groupProduct.criterias.map((criteria) => {
                    const discountValue =
                      criteria.voucher.discountType === 'PERCENTAGE'
                        ? `${criteria.voucher.discountValue * 100}%`
                        : t('productCard.price', { price: criteria.voucher.discountValue })

                    return (
                      <TableRow key={criteria.id}>
                        <TableCell className='font-medium'>
                          <div className='flex items-center gap-2'>
                            <Users className='h-4 w-4 text-muted-foreground' />
                            <span>
                              {criteria.threshold} {t('groupBuying.detail.people')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant='outline'>{criteria.voucher.code}</Badge>
                        </TableCell>
                        <TableCell>
                          {criteria.voucher.discountType === 'PERCENTAGE'
                            ? t('groupBuying.detail.percentage')
                            : t('groupBuying.detail.fixedAmount')}
                        </TableCell>
                        <TableCell className='text-right font-medium'>{discountValue}</TableCell>
                      </TableRow>
                    )
                  })}
                  {groupBuying.groupProduct.criterias.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className='text-center py-6 text-muted-foreground'>
                        {t('groupBuying.detail.noCriteria')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Products section */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Package className='h-5 w-5' />
                {t('groupBuying.detail.products')} ({groupBuying.groupProduct.products.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('groupBuying.detail.product')}</TableHead>
                    <TableHead>{t('groupBuying.detail.sku')}</TableHead>
                    <TableHead className='text-right'>{t('groupBuying.detail.price')}</TableHead>
                    <TableHead className='text-right'>{t('groupBuying.detail.status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupBuying.groupProduct.products.map((product) => {
                    const defaultClassification =
                      product.productClassifications &&
                      (product.productClassifications.find((c) => c.type === 'DEFAULT') ||
                        product.productClassifications[0])
                    const price = defaultClassification?.price || 0

                    return (
                      <TableRow key={product.id}>
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
                          <ProductState state={product.status ?? ''} size='small' />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {groupBuying.groupProduct.products.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className='text-center py-6 text-muted-foreground'>
                        {t('groupBuying.detail.noProducts')}
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
