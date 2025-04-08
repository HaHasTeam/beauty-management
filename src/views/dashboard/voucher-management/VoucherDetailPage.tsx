import { useQuery } from '@tanstack/react-query'
import { Calendar, CheckCircle, Clock, DollarSign, Eye, Percent, Store, Tag, XCircle } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Routes, routesConfig } from '@/configs/routes'
import { formatDate } from '@/lib/utils'
import { getVoucherByIdApi } from '@/network/apis/voucher'
import { TBrand } from '@/types/brand'
import { VoucherApplyTypeEnum, VoucherVisibilityEnum } from '@/types/enum'
import { formatCurrency } from '@/utils/number'

// Status badge component
function StatusBadge({ status, startTime, endTime }: { status: string; startTime: string; endTime: string }) {
  const now = new Date()
  const start = new Date(startTime)
  const end = new Date(endTime)

  let variant: 'default' | 'outline' | 'secondary' | 'destructive' | 'success' = 'outline'
  let label = status

  if (status === 'ACTIVE') {
    if (now < start) {
      variant = 'secondary'
      label = 'Scheduled'
    } else if (now > end) {
      variant = 'destructive'
      label = 'Expired'
    } else {
      variant = 'default'
      label = 'Active'
    }
  } else {
    variant = 'destructive'
    label = 'Inactive'
  }

  return <Badge variant={variant}>{label}</Badge>
}

// Loading skeleton component
function VoucherDetailSkeleton() {
  return (
    <div className='container mx-auto py-8 px-4 max-w-6xl'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center'>
          <Skeleton className='h-8 w-48' />
        </div>
        <div className='flex space-x-2'>
          <Skeleton className='h-9 w-16' />
          <Skeleton className='h-9 w-16' />
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <Card className='lg:col-span-2'>
          <CardHeader className='pb-2'>
            <div className='flex justify-between items-start'>
              <div>
                <Skeleton className='h-6 w-48 mb-2' />
                <Skeleton className='h-4 w-32' />
              </div>
              <Skeleton className='h-5 w-16' />
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <Skeleton className='h-5 w-40 mb-4' />
                <div className='space-y-2'>
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className='flex justify-between'>
                      <Skeleton className='h-4 w-32' />
                      <Skeleton className='h-4 w-48' />
                    </div>
                  ))}
                </div>
                {i < 3 && <Skeleton className='h-px w-full mt-6' />}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-40' />
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='flex flex-col items-center'>
              <Skeleton className='h-24 w-24 rounded-full mb-3' />
              <Skeleton className='h-5 w-32 mb-2' />
              <Skeleton className='h-4 w-20' />
            </div>
            <Skeleton className='h-px w-full' />
            <div className='space-y-4'>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className='flex justify-between'>
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='h-4 w-32' />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className='h-9 w-full' />
          </CardFooter>
        </Card>
      </div>

      <Card className='mt-6'>
        <CardHeader className='py-3'>
          <Skeleton className='h-5 w-32' />
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Skeleton className='h-4 w-48' />
            <Skeleton className='h-4 w-48' />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VoucherDetailPage() {
  const { id } = useParams()
  const voucherId = id ?? ''
  const navigate = useNavigate()
  const {
    data: voucherData,
    isLoading,
    error
  } = useQuery({
    queryKey: [getVoucherByIdApi.queryKey, voucherId],
    queryFn: getVoucherByIdApi.fn,
    enabled: !!voucherId,
    select: (data) => data.data
  })

  // Show loading state
  if (isLoading || !voucherId) {
    return <VoucherDetailSkeleton />
  }

  // Show error state
  if (error || !voucherData) {
    return (
      <div className='container mx-auto py-8 px-4 max-w-6xl'>
        <div className='flex items-center mb-6'>
          <h1 className='text-2xl font-bold'>Voucher Details</h1>
        </div>
        <Card className='bg-destructive/10'>
          <CardContent className='py-8'>
            <div className='text-center'>
              <XCircle className='h-12 w-12 text-destructive mx-auto mb-4' />
              <h2 className='text-xl font-semibold mb-2'>Error Loading Voucher</h2>
              <p className='text-muted-foreground'>
                {error instanceof Error ? error.message : 'Failed to load voucher details. Please try again.'}
              </p>
              <Button variant='outline' className='mt-4' asChild>
                <a href='/vouchers'>Return to Vouchers</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const voucher = voucherData

  // Format dates for display
  const formattedStartDate = formatDate(voucher.startTime, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const formattedEndDate = formatDate(voucher.endTime, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  // Check if brand is an object or just an ID
  const brandObject = typeof voucher.brand === 'object' ? (voucher.brand as TBrand) : null

  return (
    <div className='container mx-auto py-8 px-4 max-w-6xl'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center'>
          <h1 className='text-2xl font-bold'>Voucher Details</h1>
        </div>
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              navigate(routesConfig[Routes.UPDATE_VOUCHER].getPath(voucher.id))
            }}
          >
            Edit
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Main Voucher Info */}
        <Card className='lg:col-span-2'>
          <CardHeader className='pb-2'>
            <div className='flex justify-between items-start'>
              <div>
                <CardTitle className='text-xl'>{voucher.name}</CardTitle>
                <CardDescription className='mt-1 flex items-center'>
                  <span className='mr-2'>Code:</span>
                  <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm'>
                    {voucher.code}
                  </code>
                </CardDescription>
              </div>
              <StatusBadge status={voucher.status} startTime={voucher.startTime} endTime={voucher.endTime} />
            </div>
          </CardHeader>

          <CardContent className='space-y-6'>
            <div>
              <h3 className='text-sm font-medium mb-2'>Discount Information</h3>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className='w-1/3 font-medium flex items-center'>
                      <Tag className='h-4 w-4 mr-2 text-muted-foreground' />
                      Discount Type
                    </TableCell>
                    <TableCell>{voucher.discountType === 'PERCENTAGE' ? 'Percentage' : 'Fixed Amount'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className='font-medium flex items-center'>
                      <Percent className='h-4 w-4 mr-2 text-muted-foreground' />
                      Discount Value
                    </TableCell>
                    <TableCell>
                      {voucher.discountType === 'PERCENTAGE'
                        ? `${voucher.discountValue}%`
                        : formatCurrency(voucher.discountValue)}
                    </TableCell>
                  </TableRow>
                  {voucher.maxDiscount !== undefined && (
                    <TableRow>
                      <TableCell className='font-medium flex items-center'>
                        <DollarSign className='h-4 w-4 mr-2 text-muted-foreground' />
                        Max Discount
                      </TableCell>
                      <TableCell>{formatCurrency(voucher.maxDiscount)}</TableCell>
                    </TableRow>
                  )}
                  {voucher.minOrderValue !== undefined && (
                    <TableRow>
                      <TableCell className='font-medium flex items-center'>
                        <DollarSign className='h-4 w-4 mr-2 text-muted-foreground' />
                        Min Order Value
                      </TableCell>
                      <TableCell>{formatCurrency(voucher.minOrderValue)}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <Separator />

            <div>
              <h3 className='text-sm font-medium mb-2'>Validity & Availability</h3>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className='w-1/3 font-medium flex items-center'>
                      <Calendar className='h-4 w-4 mr-2 text-muted-foreground' />
                      Start Time
                    </TableCell>
                    <TableCell>{formattedStartDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className='font-medium flex items-center'>
                      <Calendar className='h-4 w-4 mr-2 text-muted-foreground' />
                      End Time
                    </TableCell>
                    <TableCell>{formattedEndDate}</TableCell>
                  </TableRow>
                  {voucher.amount !== undefined && (
                    <TableRow>
                      <TableCell className='font-medium flex items-center'>
                        <Clock className='h-4 w-4 mr-2 text-muted-foreground' />
                        Amount
                      </TableCell>
                      <TableCell>{voucher.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell className='font-medium flex items-center'>
                      <Eye className='h-4 w-4 mr-2 text-muted-foreground' />
                      Visibility
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant='outline'>
                              {voucher.visibility === VoucherVisibilityEnum.PUBLIC
                                ? 'Public'
                                : voucher.visibility === VoucherVisibilityEnum.WALLET
                                  ? 'Wallet'
                                  : 'Group'}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            {voucher.visibility === VoucherVisibilityEnum.PUBLIC
                              ? 'Visible to all customers'
                              : voucher.visibility === VoucherVisibilityEnum.WALLET
                                ? 'Only visible in customer wallet'
                                : 'Only visible to specific customer groups'}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className='font-medium flex items-center'>
                      <Tag className='h-4 w-4 mr-2 text-muted-foreground' />
                      Apply Type
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center'>
                        {voucher.applyType === VoucherApplyTypeEnum.ALL ? (
                          <CheckCircle className='h-4 w-4 mr-2 text-green-500' />
                        ) : (
                          <XCircle className='h-4 w-4 mr-2 text-red-500' />
                        )}
                        <span>
                          {voucher.applyType === VoucherApplyTypeEnum.ALL
                            ? 'Applies to all products'
                            : 'Applies to specific products'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {voucher.description && (
              <>
                <Separator />
                <div>
                  <h3 className='text-sm font-medium mb-2'>Description</h3>
                  <p className='text-sm text-muted-foreground rounded-md bg-muted p-3'>
                    {voucher.description || 'No description provided.'}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Brand Info */}
        {brandObject ? (
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Brand Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex flex-col items-center'>
                <div className='relative w-24 h-24 rounded-full overflow-hidden mb-3 border'>
                  {brandObject.logo ? (
                    <img
                      src={brandObject.logo || '/placeholder.svg'}
                      alt={brandObject.name}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full bg-muted flex items-center justify-center'>
                      <Store className='h-12 w-12 text-muted-foreground' />
                    </div>
                  )}
                </div>
                <h3 className='font-medium text-center text-lg'>{brandObject.name}</h3>
                <Badge variant='outline' className='mt-1'>
                  {brandObject.status}
                </Badge>
              </div>

              <Separator />

              <div>
                <h3 className='text-sm font-medium mb-2'>Contact Information</h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className='font-medium'>Email</TableCell>
                      <TableCell className='truncate max-w-[200px]'>{brandObject.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className='font-medium'>Phone</TableCell>
                      <TableCell>{brandObject.phone}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className='font-medium'>Address</TableCell>
                      <TableCell className='truncate max-w-[200px]'>{brandObject.address}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className='font-medium'>Tax Code</TableCell>
                      <TableCell>{brandObject.businessTaxCode}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Brand Information</CardTitle>
            </CardHeader>
            <CardContent className='py-8'>
              <div className='flex flex-col items-center text-center'>
                <Store className='h-12 w-12 text-muted-foreground mb-4' />
                <p className='text-muted-foreground'>
                  {typeof voucher.brand === 'string' ? `Brand ID: ${voucher.brand}` : 'No brand information available'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className='mt-6'>
        <CardHeader className='py-3'>
          <CardTitle className='text-sm'>Audit Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
            <div>
              <span className='text-muted-foreground'>Created:</span>
              <span className='ml-2'>
                {formatDate(voucher.createdAt, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div>
              <span className='text-muted-foreground'>Last Updated:</span>
              <span className='ml-2'>
                {formatDate(voucher.updatedAt, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
