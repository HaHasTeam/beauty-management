import { useQuery } from '@tanstack/react-query'
import { AlertCircle, Building, Calendar, FileCheck, FileText, Mail, MapPin, Phone } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate } from '@/lib/utils'
import { getBrandByIdApi } from '@/network/apis/brand'
import { useStore } from '@/stores/store'
import { BrandStatusEnum } from '@/types/brand' // Add this import if needed

import { UploadDocumentDialog } from './UploadDocumentDialog'

const getStatusConfig = (status: BrandStatusEnum) => {
  switch (status) {
    case BrandStatusEnum.PENDING_REVIEW:
      return {
        borderColor: 'border-amber-300',
        bgColor: 'bg-amber-100',
        bgTagColor: 'bg-amber-200',
        titleColor: 'text-amber-600',
        text: 'Đang chờ xét duyệt'
      }
    case BrandStatusEnum.NEED_ADDITIONAL_DOCUMENTS:
      return {
        borderColor: 'border-red-300',
        bgColor: 'bg-red-100',
        bgTagColor: 'bg-red-200',
        titleColor: 'text-red-600',
        text: 'Cần bổ sung hồ sơ'
      }
    case BrandStatusEnum.PRE_APPROVED_FOR_MEETING:
      return {
        borderColor: 'border-blue-300',
        bgColor: 'bg-blue-100',
        bgTagColor: 'bg-blue-200',
        titleColor: 'text-blue-600',
        text: 'Đã duyệt hồ sơ, chờ phỏng vấn'
      }
    case BrandStatusEnum.ACTIVE:
      return {
        borderColor: 'border-green-300',
        bgColor: 'bg-green-100',
        bgTagColor: 'bg-green-200',
        titleColor: 'text-green-600',
        text: 'Đã kích hoạt'
      }
    default:
      return {
        borderColor: 'border-gray-300',
        bgColor: 'bg-gray-100',
        bgTagColor: 'bg-gray-200',
        titleColor: 'text-gray-600',
        text: status
      }
  }
}

export default function BrandDashboard() {
  const { user } = useStore(
    useShallow((state) => {
      return {
        user: state.user
      }
    })
  )

  // Get brand ID from user
  const brandId = user?.brands?.[0]?.id

  // Fetch brand details using the ID
  const { data: brand, isLoading } = useQuery({
    queryKey: [getBrandByIdApi.queryKey, brandId ?? ''],
    queryFn: getBrandByIdApi.fn,
    enabled: !!brandId,
    select(data) {
      return data.data
    }
  })

  // Show loading state
  if (isLoading) {
    return (
      <div className='container mx-auto py-8 px-4'>
        <Card className='p-8'>
          <div className='flex flex-col items-center justify-center py-10 text-center'>
            <p className='text-muted-foreground mb-4'>Loading brand information...</p>
          </div>
        </Card>
      </div>
    )
  }

  // If no user or brand information is available
  if (!user || !brandId || !brand) {
    return (
      <div className='container mx-auto py-8 px-4'>
        <Card className='p-8'>
          <div className='flex flex-col items-center justify-center py-10 text-center'>
            <p className='text-muted-foreground mb-4'>No brand information available</p>
            <Button asChild>
              <a href='/dashboard/brand/create'>Create Brand</a>
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-8 px-4'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg'>
        <div className='flex items-center gap-4'>
          <div className='relative h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow-md'>
            <img
              src={brand.logo || '/placeholder.svg'}
              alt={`${brand.name} logo`}
              className='absolute inset-0 w-full h-full object-cover'
            />
          </div>
          <div>
            <h1 className='text-3xl font-bold'>{brand.name}</h1>
            <p className='text-muted-foreground line-clamp-4 max-w-[800px]'>
              {brand.description || 'No description available'}
            </p>
            <p className='text-xs text-muted-foreground mt-1'>ID: {brand.id?.substring(0, 8).toUpperCase() || 'N/A'}</p>
          </div>
        </div>
        <div className='flex flex-col items-end gap-2'>
          {/* Badge component with updated status config */}
          {(() => {
            const statusConfig = getStatusConfig(brand.status)
            return (
              <Badge className={`${statusConfig.bgColor} ${statusConfig.titleColor} px-3 py-1 text-xs font-medium`}>
                {statusConfig.text}
              </Badge>
            )
          })()}
          <p className='text-xs text-muted-foreground'>Last updated: {formatDate(brand.updatedAt || '')}</p>
        </div>
      </div>

      <Tabs defaultValue='overview' className='mb-8'>
        <TabsList className='mb-4'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='documents'>Documents</TabsTrigger>
          <TabsTrigger value='business'>Business Details</TabsTrigger>
        </TabsList>

        <TabsContent value='overview'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Card className='w-full'>
              <CardHeader className='bg-primary/5 pb-2'>
                <CardTitle>Brand Information</CardTitle>
                <CardDescription>Last updated on {formatDate(brand.updatedAt || '')}</CardDescription>
              </CardHeader>
              <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-4'>
                <div className='flex items-start gap-3'>
                  <div className='bg-primary/10 p-2 rounded-full'>
                    <Mail className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Email</p>
                    <p className='text-sm text-muted-foreground'>{brand.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='bg-primary/10 p-2 rounded-full'>
                    <Phone className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Phone</p>
                    <p className='text-sm text-muted-foreground'>{brand.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='bg-primary/10 p-2 rounded-full'>
                    <MapPin className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Address</p>
                    <p className='text-sm text-muted-foreground'>{brand.address || 'Not provided'}</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='bg-primary/10 p-2 rounded-full'>
                    <Calendar className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Establishment Date</p>
                    <p className='text-sm text-muted-foreground'>{formatDate(brand.establishmentDate || '')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className='w-full'>
              <CardHeader className='bg-primary/5 pb-2'>
                <CardTitle>Reviewer Information</CardTitle>
                <CardDescription>Your brand reviewer details</CardDescription>
              </CardHeader>
              <CardContent className='pt-4'>
                {brand.reviewer ? (
                  <div className='flex items-center gap-4'>
                    <div className='h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shadow-sm'>
                      {brand.reviewer.avatar ? (
                        <img
                          src={brand.reviewer.avatar || '/placeholder.svg'}
                          alt={`${brand.reviewer.firstName || ''} ${brand.reviewer.lastName || ''}`}
                          className='w-full h-full rounded-full object-cover'
                        />
                      ) : (
                        <span className='text-xl font-medium text-primary'>
                          {brand.reviewer.firstName?.charAt(0) || ''}
                          {brand.reviewer.lastName?.charAt(0) || ''}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className='font-medium text-lg'>
                        {brand.reviewer.firstName || ''} {brand.reviewer.lastName || ''}
                      </p>
                      <p className='text-sm text-muted-foreground'>{brand.reviewer.email || ''}</p>
                      <Badge variant='outline' className='mt-1'>
                        Reviewer
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className='flex flex-col items-center justify-center py-6 text-center bg-muted/20 rounded-lg'>
                    <p className='text-muted-foreground'>No reviewer assigned yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='documents'>
          <Card>
            <CardHeader className='bg-primary/5 pb-2 flex flex-col sm:flex-row justify-between sm:items-center'>
              <div>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Uploaded brand documents</CardDescription>
              </div>
              <UploadDocumentDialog
                brand={brand}
                buttonText='Upload New Document'
                buttonClassName='mt-2 sm:mt-0'
                buttonVariant='default'
              />
            </CardHeader>
            <CardContent className='pt-4'>
              {brand.documents && brand.documents.length > 0 ? (
                <div className='space-y-3'>
                  {brand.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className='flex items-center justify-between p-4 border rounded-md hover:bg-muted/50 transition-colors'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='bg-primary/10 p-2 rounded-full'>
                          <FileText className='h-5 w-5 text-primary' />
                        </div>
                        <div>
                          <p className='text-sm font-medium'>{doc.name || doc.type.replace(/_/g, ' ')}</p>
                          <p className='text-xs text-muted-foreground'>Uploaded on {formatDate(doc.createdAt)}</p>
                        </div>
                      </div>
                      <div className='flex gap-2'>
                        <Button variant='outline' size='sm' asChild>
                          <a href={doc.fileUrl} target='_blank' rel='noopener noreferrer'>
                            View
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center py-10 text-center bg-muted/20 rounded-lg'>
                  <FileText className='h-12 w-12 text-muted-foreground mb-3' />
                  <p className='text-muted-foreground'>No documents uploaded</p>
                  <div className='mt-4'>
                    <UploadDocumentDialog brand={brand} buttonText='Upload Document' />
                  </div>
                </div>
              )}

              {brand.status === 'NEED_ADDITIONAL_DOCUMENTS' && (
                <div className='mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-3'>
                  <AlertCircle className='h-6 w-6 text-amber-500 mt-0.5 flex-shrink-0' />
                  <div>
                    <p className='text-sm font-medium text-amber-800'>Additional documents required</p>
                    <p className='text-sm text-amber-700 mt-1'>
                      Please upload the required documents to complete your brand verification.
                    </p>
                    <UploadDocumentDialog
                      brand={brand}
                      buttonText='Upload Required Documents'
                      buttonClassName='mt-3'
                      buttonVariant='default'
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='business'>
          <Card>
            <CardHeader className='bg-primary/5 pb-2'>
              <CardTitle>Business Details</CardTitle>
              <CardDescription>Your business registration information</CardDescription>
            </CardHeader>
            <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-4'>
              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <div className='bg-primary/10 p-2 rounded-full'>
                    <Building className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Business Tax Code</p>
                    <p className='text-sm text-muted-foreground'>{brand.businessTaxCode || 'Not provided'}</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='bg-primary/10 p-2 rounded-full'>
                    <FileCheck className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Business Registration Code</p>
                    <p className='text-sm text-muted-foreground'>{brand.businessRegistrationCode || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <div className='bg-primary/10 p-2 rounded-full'>
                    <MapPin className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Location</p>
                    <p className='text-sm text-muted-foreground'>
                      {brand.ward || 'N/A'}, {brand.district || 'N/A'}, {brand.province || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='bg-primary/10 p-2 rounded-full'>
                    <MapPin className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Business Registration Address</p>
                    <p className='text-sm text-muted-foreground'>
                      {brand.businessRegistrationAddress || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='bg-primary/10 p-2 rounded-full'>
                    <Calendar className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Establishment Date</p>
                    <p className='text-sm text-muted-foreground'>{formatDate(brand.establishmentDate || '')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
