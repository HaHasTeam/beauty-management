'use client'

import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import {
  Ban,
  Building,
  Calendar,
  CalendarCheck,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
  Power,
  PowerOff,
  Tag,
  UserPlus
} from 'lucide-react'
import type * as React from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { getBrandByIdApi } from '@/network/apis/brand'

// Define BrandStatusEnum for type safety
enum BrandStatusEnum {
  PENDING_REVIEW = 'PENDING_REVIEW',
  NEED_ADDITIONAL_DOCUMENTS = 'NEED_ADDITIONAL_DOCUMENTS',
  PRE_APPROVED_FOR_MEETING = 'PRE_APPROVED_FOR_MEETING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

interface ViewDetailsBrandsSheetProps extends React.ComponentPropsWithRef<typeof Dialog> {
  brandId?: string
  onOpenChange?: (open: boolean) => void
  onUpdateStatusChange: (
    type:
      | 'ban'
      | 'view'
      | 'unbanned'
      | 'update-status-active'
      | 'update-status-inactive'
      | 'deny'
      | 'update-status-pre-approved-for-meeting'
      | 'update-status-needs-additional-documents'
      | 'update-status-pending-review'
      | 'assign-operator'
  ) => void
  isAdmin?: boolean
}

const LoadingSkeleton = () => (
  <div className='flex flex-col gap-6 p-6'>
    <div className='space-y-3'>
      <Skeleton className='h-8 w-1/3' />
      <Skeleton className='h-4 w-2/3' />
      <div className='grid grid-cols-1 gap-2 mt-4'>
        <Skeleton className='h-4 w-1/4' />
        <Skeleton className='h-4 w-1/2' />
        <Skeleton className='h-4 w-1/2' />
      </div>
    </div>

    <div className='space-y-3'>
      <Skeleton className='h-6 w-1/4' />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-4 w-3/4' />
      </div>
    </div>

    <div className='space-y-3'>
      <Skeleton className='h-6 w-1/4' />
      <Skeleton className='h-[400px] w-full' />
    </div>
  </div>
)

// Add the getStatusConfig function to match BrandDetailsDialog
const getStatusConfig = (status: string) => {
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

export function ViewDetailsBrandsSheet({
  brandId,
  onOpenChange,
  onUpdateStatusChange,
  isAdmin = false,
  ...props
}: ViewDetailsBrandsSheetProps) {
  const handleDownloadAll = () => {
    if (!brand?.documents || brand.documents.length === 0) return

    // Create a message to show download progress
    const downloadMessage = document.createElement('div')
    downloadMessage.className =
      'fixed bottom-4 right-4 bg-primary text-primary-foreground p-3 rounded-md shadow-lg z-50'
    downloadMessage.textContent = `Downloading ${brand.documents.length} documents...`
    document.body.appendChild(downloadMessage)

    // Download each document
    brand.documents.forEach((doc, index) => {
      setTimeout(() => {
        const fileName = doc.fileUrl.split('/').pop() || `document-${index + 1}`
        const link = document.createElement('a')
        link.href = doc.fileUrl
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Update message when all downloads are initiated
        if (index === brand.documents.length - 1) {
          downloadMessage.textContent = 'All downloads initiated!'
          setTimeout(() => {
            document.body.removeChild(downloadMessage)
          }, 3000)
        }
      }, index * 1000) // Stagger downloads by 1 second
    })
  }

  const { data: brand, isLoading } = useQuery({
    queryKey: [getBrandByIdApi.queryKey, brandId ?? ''],
    queryFn: getBrandByIdApi.fn,
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
    select(data) {
      return data.data
    }
  })

  const handleDownload = (documentUrl: string, fileNameDownload: string = 'Chứng nhận thương hiệu') => {
    const fileName = documentUrl.split('/').pop() || fileNameDownload
    const link = document.createElement('a')
    link.href = documentUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Get action buttons based on brand status
  const getActionButtons = () => {
    if (!brand || !brand.status) return null

    const currentStatus = brand.status as BrandStatusEnum

    // Define action buttons based on status
    const actionButtons = []

    // Admin can always assign operator
    if (isAdmin) {
      actionButtons.push(
        <Button
          key='assign-operator'
          className='bg-blue-500 text-white hover:bg-blue-600 transition-colors border-none shadow-md hover:shadow-lg'
          onClick={() => {
            onOpenChange?.(false)
            onUpdateStatusChange('assign-operator')
          }}
        >
          <UserPlus className='h-4 w-4 mr-2' />
          Assign Operator
        </Button>
      )
    }

    // Status-specific buttons
    if (currentStatus === BrandStatusEnum.ACTIVE) {
      actionButtons.push(
        <Button
          key='ban'
          className='bg-red-500 text-white hover:bg-red-600 transition-colors border-none shadow-md hover:shadow-lg'
          onClick={() => {
            onOpenChange?.(false)
            onUpdateStatusChange('ban')
          }}
        >
          <Ban className='h-4 w-4 mr-2' />
          Ban
        </Button>,
        <Button
          key='deactivate'
          className='bg-yellow-500 text-white hover:bg-yellow-600 transition-colors border-none shadow-md hover:shadow-lg'
          onClick={() => {
            onOpenChange?.(false)
            onUpdateStatusChange('update-status-inactive')
          }}
        >
          <PowerOff className='h-4 w-4 mr-2' />
          Deactivate
        </Button>
      )
    }

    if (currentStatus === BrandStatusEnum.INACTIVE || currentStatus === BrandStatusEnum.PRE_APPROVED_FOR_MEETING) {
      actionButtons.push(
        <Button
          key='activate'
          className='bg-green-500 text-white hover:bg-green-600 transition-colors border-none shadow-md hover:shadow-lg'
          onClick={() => {
            onOpenChange?.(false)
            onUpdateStatusChange('update-status-active')
          }}
        >
          <Power className='h-4 w-4 mr-2' />
          Activate
        </Button>
      )
    }

    if (currentStatus === BrandStatusEnum.PRE_APPROVED_FOR_MEETING) {
      actionButtons.push(
        <Button
          key='deny'
          className='bg-red-300 text-white hover:bg-red-400 transition-colors border-none shadow-md hover:shadow-lg'
          onClick={() => {
            onOpenChange?.(false)
            onUpdateStatusChange('deny')
          }}
        >
          <Power className='h-4 w-4 mr-2' />
          Deny
        </Button>
      )
    }

    if (currentStatus === BrandStatusEnum.PENDING_REVIEW) {
      actionButtons.push(
        <Button
          key='approve-for-meeting'
          className='bg-blue-500 text-white hover:bg-blue-600 transition-colors border-none shadow-md hover:shadow-lg'
          onClick={() => {
            onOpenChange?.(false)
            onUpdateStatusChange('update-status-pre-approved-for-meeting')
          }}
        >
          <CalendarCheck className='h-4 w-4 mr-2' />
          Approve for Meeting
        </Button>,
        <Button
          key='request-documents'
          className='bg-amber-500 text-white hover:bg-amber-600 transition-colors border-none shadow-md hover:shadow-lg'
          onClick={() => {
            onOpenChange?.(false)
            onUpdateStatusChange('update-status-needs-additional-documents')
          }}
        >
          <FileText className='h-4 w-4 mr-2' />
          Request Documents
        </Button>
      )
    }

    return actionButtons
  }

  return (
    <Dialog {...props} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg md:max-w-xl'>
        <DialogHeader className='py-1 sticky top-0 bg-background border-b'>
          <div className='flex items-center justify-between'>
            <DialogTitle className='text-xl font-semibold'>Thông tin thương hiệu</DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className='max-h-[calc(90vh-140px)]'>
          {isLoading ? (
            <LoadingSkeleton />
          ) : !brand ? (
            <div className='p-6 text-center'>
              <p>Brand not found or failed to load.</p>
            </div>
          ) : (
            <div className='flex flex-col gap-6 p-6'>
              {/* Brand Header with Logo - similar to BrandDetailsDialog */}
              <div className='flex items-center gap-4 mb-4'>
                {brand.logo ? (
                  <img
                    src={brand.logo || '/placeholder.svg'}
                    alt={`${brand.name} logo`}
                    className='h-16 w-16 object-contain rounded-md border border-border'
                  />
                ) : (
                  <div className='h-16 w-16 flex items-center justify-center bg-primary/10 rounded-md border border-border'>
                    <Building className='h-8 w-8 text-primary' />
                  </div>
                )}
                <div>
                  <h2 className='text-xl font-bold'>{brand.name}</h2>
                  {brand.status && (
                    <div
                      className={`${getStatusConfig(brand.status).bgTagColor} px-3 py-1 rounded-md ${
                        getStatusConfig(brand.status).titleColor
                      } font-medium text-sm inline-block mt-1`}
                    >
                      {getStatusConfig(brand.status).text}
                    </div>
                  )}
                </div>
              </div>

              <div className='space-y-6'>
                {/* Contact Information */}
                <div className='space-y-3'>
                  <h3 className='text-lg font-medium text-primary'>Thông tin liên hệ</h3>
                  <div className='grid grid-cols-1 gap-3'>
                    <div>
                      <div className='text-sm text-muted-foreground flex items-center'>
                        <Mail className='h-5 w-5 text-primary mr-2' />
                        Email
                      </div>
                      <div className='font-medium ml-7'>{brand.email}</div>
                    </div>
                    <div>
                      <div className='text-sm text-muted-foreground flex items-center'>
                        <Phone className='h-5 w-5 text-primary mr-2' />
                        Số điện thoại
                      </div>
                      <div className='font-medium ml-7'>{brand.phone}</div>
                    </div>
                    <div>
                      <div className='text-sm text-muted-foreground flex items-center'>
                        <MapPin className='h-5 w-5 text-primary mr-2' />
                        Địa chỉ
                      </div>
                      <div className='font-medium ml-7'>
                        {brand.address}, {brand.ward}, {brand.district}, {brand.province}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div className='space-y-3'>
                  <h3 className='text-lg font-medium text-primary'>Thông tin doanh nghiệp</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    <div>
                      <div className='text-sm text-muted-foreground flex items-center'>
                        <Tag className='h-5 w-5 text-primary mr-2' />
                        Mã số thuế
                      </div>
                      <div className='font-medium ml-7'>{brand.businessTaxCode}</div>
                    </div>
                    <div>
                      <div className='text-sm text-muted-foreground flex items-center'>
                        <FileText className='h-5 w-5 text-primary mr-2' />
                        Mã đăng ký kinh doanh
                      </div>
                      <div className='font-medium ml-7'>{brand.businessRegistrationCode}</div>
                    </div>
                    <div>
                      <div className='text-sm text-muted-foreground flex items-center'>
                        <Calendar className='h-5 w-5 text-primary mr-2' />
                        Ngày thành lập
                      </div>
                      <div className='font-medium ml-7'>
                        {brand.establishmentDate ? format(new Date(brand.establishmentDate), 'dd/MM/yyyy') : 'N/A'}
                      </div>
                    </div>
                    {brand.businessRegistrationAddress && (
                      <div>
                        <div className='text-sm text-muted-foreground flex items-center'>
                          <MapPin className='h-5 w-5 text-primary mr-2' />
                          Địa chỉ đăng ký
                        </div>
                        <div className='font-medium ml-7'>{brand.businessRegistrationAddress}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {brand.description && (
                  <div className='space-y-2'>
                    <h3 className='text-lg font-medium text-primary'>Mô tả</h3>
                    <div className='text-sm bg-muted/50 p-3 rounded-md'>{brand.description}</div>
                  </div>
                )}

                {/* Documents Section */}
                {brand.documents && brand.documents.length > 0 && (
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <h3 className='text-lg font-medium text-primary'>Tài liệu đính kèm</h3>
                      <Button
                        variant='outline'
                        size='sm'
                        className='flex items-center gap-1'
                        onClick={handleDownloadAll}
                      >
                        <Download className='h-4 w-4' />
                        Tải tất cả
                      </Button>
                    </div>
                    <div className='w-full border rounded p-4 space-y-2'>
                      {brand.documents.map((doc, index) => (
                        <div
                          key={doc.id}
                          className='flex items-center justify-between p-2 hover:bg-accent rounded-md transition-colors'
                        >
                          <div className='flex items-center gap-2'>
                            <FileText className='h-5 w-5 text-primary' />
                            <span>Tài liệu {index + 1}</span>
                            {doc.name && <span className='text-muted-foreground'>({doc.name})</span>}
                          </div>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='flex items-center gap-1'
                            onClick={() => handleDownload(doc.fileUrl, '')}
                          >
                            <Download className='h-4 w-4' />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Created Information */}
                <div className='text-sm text-muted-foreground'>
                  Đã tạo vào: {format(new Date(brand.createdAt), 'dd/MM/yyyy HH:mm')}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Dynamic Action Buttons based on brand status */}
        {!isLoading && brand && (
          <DialogFooter className='px-6 py-4 border-t flex flex-wrap gap-2 justify-end'>
            {getActionButtons()}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
