import { DialogTitle } from '@radix-ui/react-dialog'
import { format } from 'date-fns'
import { Building, Calendar, FileText, Info, Mail, MapPin, Phone, Tag } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { BrandStatusEnum } from '@/types/brand'

export type IBrand = {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  logo: string
  document: string
  description: string
  email: string
  phone: string
  address: string
  star: number
  status: BrandStatusEnum
  businessTaxCode: string
  businessRegistrationCode: string
  establishmentDate: string
  ward: string
  district: string
  province: string
}

export const BrandDetailsDialog = ({ brandDetails }: { brandDetails: IBrand }) => {
  if (!brandDetails) return null

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

  const statusConfig = getStatusConfig(brandDetails.status)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon' className='p-0 h-auto'>
          <Info className='h-5 w-5 text-primary' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg md:max-w-xl'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>Thông tin thương hiệu</DialogTitle>
        </DialogHeader>

        {/* Brand Header with Logo */}
        <div className='flex items-center gap-4 mb-4'>
          {brandDetails.logo ? (
            <img
              src={brandDetails.logo || '/placeholder.svg'}
              alt={`${brandDetails.name} logo`}
              className='h-16 w-16 object-contain rounded-md border border-border'
            />
          ) : (
            <div className='h-16 w-16 flex items-center justify-center bg-primary/10 rounded-md border border-border'>
              <Building className='h-8 w-8 text-primary' />
            </div>
          )}
          <div>
            <h2 className='text-xl font-bold'>{brandDetails.name}</h2>
            <div
              className={`${statusConfig.bgTagColor} px-3 py-1 rounded-md ${statusConfig.titleColor} font-medium text-sm inline-block mt-1`}
            >
              {statusConfig.text}
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          {/* Contact Information */}
          <div className='space-y-3'>
            <h3 className='text-lg font-medium text-primary'>Thông tin liên hệ</h3>
            <div className='grid grid-cols-1 gap-3'>
              <div className='flex items-center gap-2'>
                <Mail className='h-5 w-5 text-primary' />
                <div>
                  <div className='text-sm text-muted-foreground'>Email</div>
                  <div className='font-medium'>{brandDetails.email}</div>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Phone className='h-5 w-5 text-primary' />
                <div>
                  <div className='text-sm text-muted-foreground'>Số điện thoại</div>
                  <div className='font-medium'>{brandDetails.phone}</div>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <MapPin className='h-5 w-5 text-primary mt-0.5' />
                <div>
                  <div className='text-sm text-muted-foreground'>Địa chỉ</div>
                  <div className='font-medium'>
                    {brandDetails.address}, {brandDetails.ward}, {brandDetails.district}, {brandDetails.province}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className='space-y-3'>
            <h3 className='text-lg font-medium text-primary'>Thông tin doanh nghiệp</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <div className='flex items-center gap-2'>
                <Tag className='h-5 w-5 text-primary' />
                <div>
                  <div className='text-sm text-muted-foreground'>Mã số thuế</div>
                  <div className='font-medium'>{brandDetails.businessTaxCode}</div>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <FileText className='h-5 w-5 text-primary' />
                <div>
                  <div className='text-sm text-muted-foreground'>Mã đăng ký kinh doanh</div>
                  <div className='font-medium'>{brandDetails.businessRegistrationCode}</div>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Calendar className='h-5 w-5 text-primary' />
                <div>
                  <div className='text-sm text-muted-foreground'>Ngày thành lập</div>
                  <div className='font-medium'>
                    {brandDetails.establishmentDate
                      ? format(new Date(brandDetails.establishmentDate), 'dd/MM/yyyy')
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {brandDetails.description && (
            <div className='space-y-2'>
              <h3 className='text-lg font-medium text-primary'>Mô tả</h3>
              <div className='text-sm bg-muted/50 p-3 rounded-md'>{brandDetails.description}</div>
            </div>
          )}

          {/* Created Information */}
          <div className='text-sm text-muted-foreground'>
            Đã tạo vào: {format(new Date(brandDetails.createdAt), 'dd/MM/yyyy HH:mm')}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
