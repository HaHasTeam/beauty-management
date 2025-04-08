import { DialogTitle } from '@radix-ui/react-dialog'
import { format } from 'date-fns'
import { Calendar, Clock, Info, Link, MessageSquare } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import type { BookingStatusEnum } from '@/types/enum'
import { getBookingStatusConfig } from '@/views/dashboard/schedule-booking/booking-status-config'
import { getStatusBookingText } from '@/views/dashboard/schedule-booking/helper'

// Create a BookingDetailsDialog component
export const BookingDetailsDialog = ({
  bookingDetails
}: {
  bookingDetails: {
    voucherDiscount: number
    id: string
    createdAt: string
    updatedAt: string
    totalPrice: number
    startTime: string
    endTime: string
    paymentMethod: string
    notes: string
    meetUrl: string
    record: string | null
    type: string
    status: string
    resultNote: string | null
  }
}) => {
  // Mock translation function for demo purposes
  const { t } = useTranslation()

  if (!bookingDetails) return null

  const status = bookingDetails.status as BookingStatusEnum
  const statusConfig = getBookingStatusConfig(t)[status] || {
    borderColor: 'border-gray-300',
    bgColor: 'bg-gray-100',
    titleColor: 'text-gray-600',
    alertTitle: status
  }

  const statusText = getStatusBookingText(status as BookingStatusEnum, t)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon' className='p-0 h-auto'>
          <Info className='h-5 w-5 text-primary' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg md:max-w-xl '>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>Chi tiết đặt lịch phỏng vấn</DialogTitle>
        </DialogHeader>

        {/* Status Badge */}
        <div className={`${statusConfig.alertVariant} ${statusConfig.borderColor} mb-4`}>
          <div className='flex items-center'>
            <div className={`${statusConfig.bgTagColor} px-3 py-1 rounded-md ${statusConfig.titleColor} font-medium`}>
              {statusText}
            </div>
          </div>
        </div>

        <div className='space-y-6 mb-7'>
          {/* Time Information */}
          <div className='space-y-3'>
            <h3 className='text-lg font-medium'>Thông tin thời gian</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <div className='flex items-center gap-2 text-sm text-muted-foreground mb-1'>
                  <Calendar className='h-5 w-5 text-primary flex-shrink-0' />
                  <span>Thời gian bắt đầu</span>
                </div>
                <div className='font-medium ml-7'>
                  {bookingDetails.startTime ? format(new Date(bookingDetails.startTime), 'dd/MM/yyyy HH:mm') : 'N/A'}
                </div>
              </div>
              <div>
                <div className='flex items-center gap-2 text-sm text-muted-foreground mb-1'>
                  <Clock className='h-5 w-5 text-primary flex-shrink-0' />
                  <span>Thời gian kết thúc</span>
                </div>
                <div className='font-medium ml-7'>
                  {bookingDetails.endTime ? format(new Date(bookingDetails.endTime), 'dd/MM/yyyy HH:mm') : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className='space-y-3'>
            <h3 className='text-lg font-medium'>Thông tin bổ sung</h3>
            {bookingDetails.notes && (
              <div>
                <div className='flex items-center gap-2 text-sm text-muted-foreground mb-1'>
                  <MessageSquare className='h-5 w-5 text-primary flex-shrink-0' />
                  <span>Ghi chú</span>
                </div>
                <div className='font-medium ml-7'>{bookingDetails.notes}</div>
              </div>
            )}

            {bookingDetails.meetUrl && (
              <div>
                <div className='flex items-center gap-2 text-sm text-muted-foreground mb-1'>
                  <Link className='h-5 w-5 text-primary flex-shrink-0' />
                  <span>Link phỏng vấn</span>
                </div>
                <div className='ml-7'>
                  <a
                    href={bookingDetails.meetUrl}
                    target='_blank'
                    rel='noreferrer'
                    className='text-primary hover:underline font-medium inline-flex items-center gap-1'
                  >
                    Tham gia phỏng vấn
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-external-link'
                    >
                      <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
                      <polyline points='15 3 21 3 21 9' />
                      <line x1='10' x2='21' y1='14' y2='3' />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
