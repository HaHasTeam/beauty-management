import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Calendar, History, MessageSquare, SquareUserRound, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import BookingGeneral from '@/components/booking-detail/BookingGeneral'
import BookingStatusTracking from '@/components/booking-detail/BookingStatusTracking'
import BookingStatusTrackingDetail from '@/components/booking-detail/BookingStatusTrackingDetail'
import BookingSummary from '@/components/booking-detail/BookingSummary'
import UpdateBookingStatus from '@/components/booking-detail/UpdateBookingStatus'
import Empty from '@/components/empty/Empty'
import ImageWithFallback from '@/components/image/ImageWithFallback'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Routes, routesConfig } from '@/configs/routes'
import { getBookingByIdApi } from '@/network/apis/booking/details'
import { useStore } from '@/stores/store'
import { BookingStatusEnum, RoleEnum } from '@/types/enum'

import BookingStatus from './BookingStatus'
import CancelBookingDialog from './CancelBookingDialog'

const BookingDetail = () => {
  const { id: bookingId } = useParams()

  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [openCancelBookingDialog, setOpenCancelBookingDialog] = useState<boolean>(false)
  const [isTrigger, setIsTrigger] = useState<boolean>(false)
  // const { successToast } = useToast()
  // const handleServerError = useHandleServerError()

  // Use React Query hooks for data fetching
  const { data: bookingData, isFetching: isFetchingBooking } = useQuery({
    queryKey: [getBookingByIdApi.queryKey, bookingId ?? ''],
    queryFn: getBookingByIdApi.fn,
    enabled: !!bookingId
  })

  const isFetching = isFetchingBooking

  useEffect(() => {
    if (isTrigger && queryClient) {
      queryClient.invalidateQueries({
        queryKey: [getBookingByIdApi.queryKey]
      })
      setIsTrigger(false)
    }
  }, [isTrigger, queryClient])

  const canCancel =
    bookingData?.data?.status === BookingStatusEnum.TO_PAY ||
    bookingData?.data?.status === BookingStatusEnum.WAIT_FOR_CONFIRMATION

  const isMeetingJoinable =
    bookingData?.data?.status === BookingStatusEnum.BOOKING_CONFIRMED && bookingData?.data?.meetUrl

  const { user } = useStore(
    useShallow((state) => ({
      user: state.user
    }))
  )

  return (
    <div className='bg-background min-h-[calc(100vh-64px)] pb-6'>
      {isFetching && <LoadingContentLayer />}
      <div className='w-full max-w-screen-xl mx-auto lg:px-5 md:px-4 sm:px-3 px-3 space-y-6 py-5'>
        {/* Header with booking ID and status */}
        <div className='flex gap-2 w-full sm:justify-between sm:items-center sm:flex-row flex-col bg-white p-4 rounded-lg shadow-sm'>
          <div className='flex gap-2 items-center'>
            <span className='text-lg text-foreground font-medium'>{t('booking.detail')}</span>
            {!isFetching && bookingData?.data && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className='cursor-default'>
                    <span className='text-lg text-muted-foreground'>#{bookingData?.data?.id?.substring(0, 8)}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{bookingData?.data?.id}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {!isFetching && bookingData?.data && (
            <div className='flex gap-2 items-center'>
              <span className='text-muted-foreground font-medium'>{t('booking.statusLabel')}: </span>
              <BookingStatus status={bookingData?.data?.status || ''} />
            </div>
          )}
        </div>

        {!isFetching && bookingData?.data && (
          <>
            <div className='space-y-6 w-full'>
              {/* Booking status tracking */}
              <BookingStatusTracking statusTrackingData={bookingData?.data?.statusTrackings} />

              {/* Update booking status */}
              <UpdateBookingStatus
                booking={bookingData?.data}
                statusTracking={bookingData?.data?.statusTrackings ?? []}
                isConsultant={user?.role === RoleEnum.CONSULTANT}
                isCustomer={user?.role === RoleEnum.CUSTOMER}
                setOpenCancelBookingDialog={setOpenCancelBookingDialog}
              />
              {/* Consultant info and timeline */}
              <div className='flex flex-col md:flex-row gap-4 justify-between w-full items-stretch'>
                <div className='w-full md:w-1/2 flex'>
                  <BookingGeneral
                    title={t('booking.timeline')}
                    icon={<History className='w-5 h-5' />}
                    content={
                      bookingData?.data?.statusTrackings ? (
                        <BookingStatusTrackingDetail statusTrackingData={bookingData?.data?.statusTrackings} />
                      ) : (
                        <p></p>
                      )
                    }
                  />
                </div>
                <div className='w-full md:w-1/2 flex flex-col gap-4'>
                  <BookingGeneral
                    title={t('booking.consultantInfo')}
                    icon={<SquareUserRound className='w-5 h-5' />}
                    content={
                      <div className='flex flex-col gap-3'>
                        <div className='flex items-center gap-3'>
                          <Avatar className='h-16 w-16 border border-primary/20'>
                            <AvatarImage
                              src={bookingData?.data?.consultantService?.account?.avatar}
                              alt={bookingData?.data?.consultantService?.account?.username}
                            />
                            <AvatarFallback className='bg-primary/10 text-primary text-lg'>
                              {bookingData?.data?.consultantService?.account?.username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Link
                              to={`/consultant/${bookingData?.data?.consultantService?.account?.id}`}
                              className='font-medium text-lg hover:text-primary transition-colors'
                            >
                              {bookingData?.data?.consultantService?.account?.username}
                            </Link>
                            <p className='text-sm text-muted-foreground'>
                              {bookingData?.data?.consultantService?.account?.email}
                            </p>
                            <p className='text-sm text-muted-foreground'>
                              {bookingData?.data?.consultantService?.account?.phone}
                            </p>
                          </div>
                        </div>

                        <div className='mt-2 flex gap-3'>
                          <Button className='flex items-center gap-1 bg-primary hover:bg-primary/90' variant='default'>
                            <MessageSquare className='w-4 h-4' />
                            <span>{t('booking.chatWithConsultant')}</span>
                          </Button>
                          <Link
                            to={`/consultant/${bookingData?.data?.consultantService?.account?.id}`}
                            className='flex py-1.5 px-3 rounded-md items-center border border-primary text-primary hover:text-primary hover:bg-primary/10'
                          >
                            <User className='w-4 h-4 mr-1' />
                            {t('booking.viewProfile')}
                          </Link>
                        </div>
                      </div>
                    }
                  />

                  <BookingGeneral
                    title={t('booking.appointmentDetails')}
                    icon={<Calendar className='w-5 h-5' />}
                    content={
                      <div className='flex flex-col gap-2 text-base'>
                        <div className='grid grid-cols-2 gap-1'>
                          <p className='text-muted-foreground'>{t('booking.date')}:</p>
                          <p className='font-medium'>
                            {t('date.toLocaleDateTimeString', { val: new Date(bookingData?.data?.startTime) })}
                          </p>
                        </div>

                        <div className='grid grid-cols-2 gap-1'>
                          <p className='text-muted-foreground'>{t('booking.duration')}:</p>
                          <p className='font-medium'>60 {t('booking.minutes')}</p>
                        </div>

                        {bookingData?.data?.notes && (
                          <div className='grid grid-cols-1 gap-1 mt-2'>
                            <p className='text-muted-foreground'>{t('booking.notes')}:</p>
                            <p className='font-medium bg-muted/30 p-2 rounded-md'>{bookingData?.data?.notes}</p>
                          </div>
                        )}

                        {isMeetingJoinable && (
                          <div className='mt-3'>
                            <a
                              href={bookingData?.data?.meetUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md inline-flex items-center gap-2 w-full justify-center'
                            >
                              <Calendar className='w-4 h-4' />
                              {t('booking.joinMeeting')}
                            </a>
                          </div>
                        )}
                      </div>
                    }
                  />
                </div>
              </div>

              {/* Customer information */}

              <BookingGeneral
                title={t('booking.customerInfo')}
                icon={<User className='w-5 h-5' />}
                content={
                  <div className='flex items-center justify-between gap-3'>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-16 w-16 border border-primary/20'>
                        <AvatarImage
                          src={bookingData?.data?.account?.avatar}
                          alt={bookingData?.data?.account?.username}
                        />
                        <AvatarFallback className='bg-primary/10 text-primary text-lg'>
                          {bookingData?.data?.account?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link
                          to={`/consultant/${bookingData?.data?.account?.id}`}
                          className='font-medium text-lg hover:text-primary transition-colors'
                        >
                          {bookingData?.data?.account?.username}
                        </Link>
                        <p className='text-sm text-muted-foreground'>{bookingData?.data?.account?.email}</p>
                        <p className='text-sm text-muted-foreground'>{bookingData?.data?.account?.phone}</p>
                      </div>
                    </div>

                    <div className='flex gap-3'>
                      <Button className='flex items-center gap-1 bg-primary hover:bg-primary/90' variant='default'>
                        <MessageSquare className='w-4 h-4' />
                        <span>{t('store.chat')}</span>
                      </Button>
                      <Link
                        to={`/account/${bookingData?.data?.account?.id}`}
                        className='flex py-1.5 px-3 rounded-md items-center border border-primary text-primary hover:text-primary hover:bg-primary/10'
                      >
                        <User className='w-4 h-4 mr-1' />
                        {t('booking.viewProfile')}
                      </Link>
                    </div>
                  </div>
                }
              />

              {/* Service details */}
              <Card className='w-full bg-white rounded-lg p-4 shadow-sm'>
                <h3 className='font-medium text-lg border-b border-border pb-3 mb-4'>{t('booking.serviceDetails')}</h3>
                <div className='flex gap-6 items-start'>
                  <div className='w-28 h-28 rounded-md overflow-hidden flex-shrink-0 bg-primary/5'>
                    <ImageWithFallback
                      src={bookingData?.data?.consultantService?.systemService?.images?.[0]?.fileUrl}
                      className='w-full h-full object-cover'
                      fallback={fallBackImage}
                    />
                  </div>

                  <div className='flex-1'>
                    <div className='flex justify-between items-center'>
                      <div>
                        <h3 className='font-medium text-lg mb-2 text-gray-800'>
                          {bookingData?.data?.consultantService?.systemService?.name}
                        </h3>
                        <Badge
                          variant={
                            bookingData?.data?.consultantService?.systemService?.type === 'PREMIUM'
                              ? 'default'
                              : 'secondary'
                          }
                          className={
                            bookingData?.data?.consultantService?.systemService?.type === 'PREMIUM'
                              ? 'bg-primary/90 text-sm'
                              : 'text-sm'
                          }
                        >
                          {bookingData?.data?.consultantService?.systemService?.type}
                        </Badge>
                      </div>

                      {/* Price info */}
                      <div className='flex-shrink-0 text-right'>
                        <div className='text-xl font-semibold text-primary'>
                          {t('productCard.price', { price: bookingData?.data?.totalPrice })}
                        </div>
                      </div>
                    </div>

                    <Separator className='my-3' />

                    <div
                      className='text-base text-muted-foreground mb-3 mt-0 pt-0 line-clamp-3 overflow-ellipsis quill-content'
                      dangerouslySetInnerHTML={{
                        __html: bookingData?.data?.consultantService?.systemService?.description
                      }}
                    />
                  </div>
                </div>
              </Card>

              {/* Payment summary */}
              <BookingSummary
                totalPrice={bookingData?.data?.totalPrice}
                voucherDiscount={0} // Replace with actual value when available
                paymentMethod={bookingData?.data?.paymentMethod}
              />

              {/* Action buttons */}
              <div className='w-full flex items-center gap-2 mt-6'>
                {canCancel && (
                  <Button
                    variant='outline'
                    className='w-full border border-destructive text-destructive hover:text-destructive hover:bg-destructive/10'
                    onClick={() => setOpenCancelBookingDialog(true)}
                  >
                    {t('booking.cancelBooking')}
                  </Button>
                )}

                {isMeetingJoinable && (
                  <a
                    href={bookingData?.data?.meetUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-full bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md inline-flex items-center justify-center gap-2'
                  >
                    <Calendar className='w-4 h-4' />
                    {t('booking.joinMeeting')}
                  </a>
                )}
              </div>
            </div>
          </>
        )}

        {!isFetching && (!bookingData || !bookingData?.data) && (
          <div className='my-auto'>
            <Empty
              title={t('empty.bookingDetail.title')}
              description={t('empty.bookingDetail.description')}
              link={routesConfig[Routes.BOOKING_LIST].getPath()}
              linkText={t('empty.bookingDetail.button')}
            />
          </div>
        )}

        {/* Cancel Booking Dialog */}
        {!isFetching && bookingData?.data && (
          <CancelBookingDialog
            open={openCancelBookingDialog}
            setOpen={setOpenCancelBookingDialog}
            onOpenChange={setOpenCancelBookingDialog}
            setIsTrigger={setIsTrigger}
            bookingId={bookingData?.data?.id ?? ''}
          />
        )}
      </div>
    </div>
  )
}

export default BookingDetail
