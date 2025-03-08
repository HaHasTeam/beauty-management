'use client'

import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { BookingStatusEnum } from '@/types/enum'

type BookingDetailsProps = {
  isOpen: boolean
  onClose: () => void
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
  } | null
}

export function BookingDetailsDialog({ isOpen, onClose, bookingDetails }: BookingDetailsProps) {
  if (!bookingDetails) return null

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm - dd/MM/yyyy', { locale: vi })
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case BookingStatusEnum.WAIT_FOR_CONFIRMATION:
        return 'Chờ xác nhận'
      case BookingStatusEnum.BOOKING_CONFIRMED:
        return 'Đã xác nhận'
      case BookingStatusEnum.COMPLETED:
        return 'Hoàn thành'
      case BookingStatusEnum.CANCELLED:
        return 'Đã hủy'
      default:
        return status
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Chi tiết lịch phỏng vấn</DialogTitle>
          <DialogDescription>Thông tin chi tiết về lịch phỏng vấn của bạn.</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-3 items-center gap-4'>
            <span className='text-sm font-medium'>Trạng thái:</span>
            <span className='col-span-2 text-sm'>{getStatusText(bookingDetails.status)}</span>
          </div>
          <div className='grid grid-cols-3 items-center gap-4'>
            <span className='text-sm font-medium'>Thời gian bắt đầu:</span>
            <span className='col-span-2 text-sm'>{formatDate(bookingDetails.startTime)}</span>
          </div>
          <div className='grid grid-cols-3 items-center gap-4'>
            <span className='text-sm font-medium'>Thời gian kết thúc:</span>
            <span className='col-span-2 text-sm'>{formatDate(bookingDetails.endTime)}</span>
          </div>
          {bookingDetails.notes && (
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium'>Ghi chú:</span>
              <span className='col-span-2 text-sm'>{bookingDetails.notes}</span>
            </div>
          )}
          {bookingDetails.meetUrl && (
            <div className='grid grid-cols-3 items-center gap-4'>
              <span className='text-sm font-medium'>Link phỏng vấn:</span>
              <a
                href={bookingDetails.meetUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='col-span-2 text-sm text-primary hover:underline truncate'
              >
                {bookingDetails.meetUrl}
              </a>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type='button' onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
