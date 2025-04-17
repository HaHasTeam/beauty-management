import { Calendar, ChevronDown, ChevronUp, Clock, Crown, ExternalLink, InfoIcon, VideoIcon } from 'lucide-react'
import { useState } from 'react'

import { PreviewDialog } from '@/components/file-input/PreviewImageDialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, formatDate } from '@/lib/utils'
import { TBooking } from '@/types/booking'

interface BookingDetailsCellProps {
  booking: TBooking
}

export function BookingDetailsCell({ booking }: BookingDetailsCellProps) {
  const [expanded, setExpanded] = useState(false)

  // Extract service information
  const systemService = booking.consultantService?.systemService || {}
  const serviceType = systemService.type || 'standard'
  const serviceName = systemService.name || 'Unknown Service'
  const serviceImage = systemService.images?.[0]
  const serviceImageUrl = serviceImage?.fileUrl || ''
  // Check if this is a premium service with additional features
  const isPremium = serviceType?.toLowerCase() === 'premium'
  const hasMeetUrl = isPremium && booking.meetUrl
  const hasRecording = isPremium && Boolean(booking.record)

  // Format date and time
  const bookingDate = formatDate(new Date(booking.startTime), {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  })

  // Hàm để định dạng thời gian chỉ hiển thị HH:MM
  const formatTimeHHMM = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const startTimeHHMM = formatTimeHHMM(new Date(booking.startTime))
  const endTimeHHMM = formatTimeHHMM(new Date(booking.endTime))
  const timeRange = `${startTimeHHMM} - ${endTimeHHMM}`

  const toggleExpanded = () => setExpanded(!expanded)

  // Định dạng kiểu dịch vụ: Xóa dấu gạch dưới, chuyển về lowercase và chỉ viết hoa chữ cái đầu mỗi từ
  const formatServiceType = (type: string) => {
    if (!type) return 'Standard'

    return type
      .toLowerCase()
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Xác định màu sắc và icon cho service type
  const getServiceTypeConfig = () => {
    if (isPremium) {
      return {
        colorClasses: 'border-violet-200 bg-violet-100 text-violet-800 shadow-sm',
        icon: Crown
      }
    }
    return {
      colorClasses: 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm',
      icon: InfoIcon
    }
  }

  const { colorClasses, icon: TypeIcon } = getServiceTypeConfig()

  // Get service initials for avatar fallback
  const getServiceInitials = () => {
    if (!serviceName) return 'S'
    const words = serviceName.split(' ')
    if (words.length === 1) return words[0].charAt(0).toUpperCase()
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
  }

  return (
    <div className='w-full rounded-md'>
      <div className='p-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Badge variant='outline' className={cn('gap-1 whitespace-nowrap font-medium', colorClasses)}>
              <TypeIcon className='h-3.5 w-3.5' />
              <span>{formatServiceType(serviceType)}</span>
            </Badge>
            <div className='flex items-center gap-2'>
              <Avatar className='h-6 w-6 rounded-full border shadow-sm'>
                <AvatarImage src={serviceImageUrl} alt={serviceName} />
                <AvatarFallback className='bg-slate-50 text-slate-600 text-xs'>{getServiceInitials()}</AvatarFallback>
              </Avatar>
              <div className='text-sm font-medium truncate max-w-[170px]'>{serviceName}</div>
            </div>
          </div>

          <Button
            variant='ghost'
            size='sm'
            className='h-7 w-7 p-0 ml-1'
            onClick={toggleExpanded}
            aria-label={expanded ? 'Collapse details' : 'Expand details'}
          >
            {expanded ? (
              <ChevronUp className='h-4 w-4 text-muted-foreground' />
            ) : (
              <ChevronDown className='h-4 w-4 text-muted-foreground' />
            )}
          </Button>
        </div>

        {/* Date, time & meet URL row */}
        <div className='mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
          <div className='flex items-center'>
            <Calendar className='h-3.5 w-3.5 mr-1.5 text-slate-500' />
            <span>{bookingDate}</span>
          </div>
          <span>•</span>
          <div className='flex items-center'>
            <Clock className='h-3.5 w-3.5 mr-1.5 text-slate-500' />
            <span className='font-medium'>{timeRange}</span>
          </div>

          {hasMeetUrl && (
            <>
              <span>•</span>
              <div className='flex items-center'>
                <ExternalLink className='h-3.5 w-3.5 mr-1.5 text-indigo-500' />
                <a
                  href={booking.meetUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-xs text-indigo-500 hover:underline font-medium'
                >
                  Join Meeting
                </a>
              </div>
            </>
          )}
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className='mt-3 space-y-2.5 pl-1 pt-3 border-t border-gray-100'>
            {/* Notes */}
            {booking.notes && (
              <div className='text-xs text-muted-foreground'>
                <span className='font-medium'>Notes: </span>
                <span className='italic text-slate-600'>"{booking.notes}"</span>
              </div>
            )}

            {/* Premium features - Show only recording */}
            {isPremium && hasRecording && (
              <div className='mt-3 pt-2 border-t border-gray-100 flex flex-wrap gap-3'>
                <div className='flex items-center'>
                  <VideoIcon className='h-3.5 w-3.5 mr-1.5 text-violet-600' />
                  <PreviewDialog
                    trigger={
                      <Button variant='link' className='p-0 h-auto text-xs text-violet-600 hover:underline font-medium'>
                        View Recording
                      </Button>
                    }
                    content={booking.record as string}
                    contentType='video'
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
