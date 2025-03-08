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
              <div className='flex items-center gap-2'>
                <Calendar className='h-5 w-5 text-primary' />
                <div>
                  <div className='text-sm text-muted-foreground'>Thời gian bắt đầu</div>
                  <div className='font-medium'>
                    {bookingDetails.startTime ? format(new Date(bookingDetails.startTime), 'dd/MM/yyyy HH:mm') : 'N/A'}
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Clock className='h-5 w-5 text-primary' />
                <div>
                  <div className='text-sm text-muted-foreground'>Thời gian kết thúc</div>
                  <div className='font-medium'>
                    {bookingDetails.endTime ? format(new Date(bookingDetails.endTime), 'dd/MM/yyyy HH:mm') : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className='space-y-3'>
            <h3 className='text-lg font-medium'>Thông tin bổ sung</h3>
            {bookingDetails.notes && (
              <div className='flex items-start gap-2'>
                <MessageSquare className='h-5 w-5 text-primary mt-0.5' />
                <div>
                  <div className='text-sm text-muted-foreground'>Ghi chú</div>
                  <div className='font-medium'>{bookingDetails.notes}</div>
                </div>
              </div>
            )}

            {bookingDetails.meetUrl && (
              <div className='flex items-start gap-2'>
                <Link className='h-5 w-5 text-primary mt-0.5' />
                <div>
                  <div className='text-sm text-muted-foreground'>Link phỏng vấn</div>
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
