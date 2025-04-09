import { useQuery } from '@tanstack/react-query'
import { Calendar, FileCheck, ShieldCheck, Store, ThumbsUp, User } from 'lucide-react'
import { cloneElement, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { Card } from '@/components/ui/card'
// Add these imports at the top
import { Routes, routesConfig } from '@/configs/routes'
import { cn } from '@/lib/utils'
import { getStatusBookingsApi } from '@/network/apis/booking'
import { BrandStatusEnum } from '@/types/brand'
import { BookingStatusEnum, RoleEnum } from '@/types/enum'
import type { TUser } from '@/types/user'

import { BookingDetailsDialog } from './booking-details-dialog'
import { BrandDetailsDialog } from './brand-details-dialog'

const useUserStatus = (userProfileData: TUser | undefined) => {
  return useMemo(() => {
    const isEmailVerify = !!userProfileData?.isEmailVerify
    const isAdminOrOperator = userProfileData?.role === RoleEnum.ADMIN || userProfileData?.role === RoleEnum.OPERATOR
    const hasBrands = !!userProfileData?.brands && userProfileData.brands.length > 0
    const brandStatus =
      hasBrands && userProfileData?.brands && userProfileData.brands[0] ? userProfileData.brands[0].status : null
    const isRegisterBrand = hasBrands
    const isRegistrationComplete = brandStatus === BrandStatusEnum.ACTIVE

    return {
      isEmailVerify,
      isAdminOrOperator,
      hasBrands,
      brandStatus,
      isRegisterBrand,
      isRegistrationComplete
    }
  }, [userProfileData])
}

const useCompletionPercentage = (
  isEmailVerify: boolean,
  isRegisterBrand: boolean,
  brandStatus: BrandStatusEnum | null,
  isInterviewSlotSelected: boolean,
  isRegistrationComplete: boolean
) => {
  return useMemo(() => {
    const totalSteps = 6
    let completedSteps = 1 // Register account is always completed if we have user data

    if (isEmailVerify) completedSteps++
    if (isRegisterBrand) completedSteps++
    if (brandStatus === BrandStatusEnum.PRE_APPROVED_FOR_MEETING || brandStatus === BrandStatusEnum.ACTIVE)
      completedSteps++
    if (isInterviewSlotSelected) completedSteps++
    if (isRegistrationComplete) completedSteps++

    return Math.round((completedSteps / totalSteps) * 100)
  }, [isEmailVerify, isRegisterBrand, brandStatus, isInterviewSlotSelected, isRegistrationComplete])
}

// Modify the renderStep function to include the booking icon for step 5
// Find the renderStep function and update it to:
const renderStep = (
  step: number,
  icon: React.ReactNode,
  title: string,
  content: React.ReactNode,
  isCompleted: boolean,
  onClick?: () => void,
  extraContent?: React.ReactNode
) => (
  <Card
    onClick={onClick}
    className={cn(
      isCompleted && 'bg-primary/10 after:border-primary',
      onClick && 'cursor-pointer',
      step < 6 &&
        "after:-right-4 after:absolute after:top-1/2 after:inline-block after:h-0 after:w-4 after:border-2 after:border-b after:content-['']",
      'shadow-sm p-4 relative z-10'
    )}
  >
    <div className='flex justify-between items-start'>
      <div>
        {cloneElement(icon as React.ReactElement, {
          className: cn(isCompleted && 'text-primary', 'w-8 h-8 mb-3')
        })}
      </div>
      {extraContent}
    </div>
    <h3 className='font-medium mb-1'>{title}</h3>
    {content}
  </Card>
)

function RegisterProcess({ userProfileData }: { userProfileData?: TUser }) {
  const navigate = useNavigate()

  const { isEmailVerify, isAdminOrOperator, hasBrands, brandStatus, isRegisterBrand, isRegistrationComplete } =
    useUserStatus(userProfileData)

  const { data: bookingData, isLoading: isBookingLoading } = useQuery({
    queryKey: [getStatusBookingsApi.queryKey],
    queryFn: getStatusBookingsApi.fn,
    enabled: hasBrands,
    retry: false
  })

  const isInterviewSlotSelected =
    !!bookingData &&
    [
      BookingStatusEnum.WAIT_FOR_CONFIRMATION,
      BookingStatusEnum.BOOKING_CONFIRMED,
      BookingStatusEnum.COMPLETED
    ].includes(bookingData.data)

  // const { data: bookingDetailsData } = useQuery({
  //   queryKey: [getBookingDetailsApi.queryKey],
  //   queryFn: getBookingDetailsApi.fn,
  //   enabled: isInterviewSlotSelected
  // })

  const completionPercentage = useCompletionPercentage(
    isEmailVerify,
    isRegisterBrand,
    brandStatus,
    isInterviewSlotSelected,
    isRegistrationComplete
  )

  if (
    isAdminOrOperator ||
    !userProfileData ||
    userProfileData.role !== RoleEnum.MANAGER ||
    completionPercentage === 100
  ) {
    return null
  }

  return (
    <>
      <div className='mb-6 flex items-center gap-2 '>
        <h2 className='text-4xl font-semibold'>Hồ sơ thương hiệu đã hoàn thành</h2>
        <span className='bg-primary text-white px-2  py-0.5 rounded text-4xl font-medium'>{completionPercentage}%</span>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-6 gap-4 relative'>
        {renderStep(1, <User />, 'Đăng ký tài khoản', <p className='text-sm text-primary'>Hoàn thành!</p>, true)}

        {renderStep(
          2,
          <ShieldCheck />,
          'Kích hoạt tài khoản',
          isEmailVerify ? (
            <p className='text-sm text-primary'>Hoàn thành!</p>
          ) : (
            <p className='text-sm text-muted-foreground'>
              Vui lòng xác thực tài khoản email{' '}
              <a
                className='cursor-pointer'
                target='_blank'
                href='https://mail.google.com/mail/u/0/#inbox'
                rel='noreferrer'
              >
                <span className='text-sm text-primary'>Link</span>
              </a>
            </p>
          ),
          isEmailVerify
        )}

        {renderStep(
          3,
          <Store />,
          'Đăng ký Thương hiệu',
          isRegisterBrand ? (
            <p className='text-sm text-primary'>Hoàn thành!</p>
          ) : (
            <p className='text-sm text-muted-foreground'>
              {isEmailVerify ? 'Vui lòng cung cấp thông tin' : 'Kích hoạt tài khoản trước'}
            </p>
          ),
          isRegisterBrand,
          () => {
            if (isEmailVerify && !isRegisterBrand) {
              navigate(routesConfig[Routes.REGISTER_BRAND].path)
            }
          },
          isRegisterBrand && userProfileData?.brands && userProfileData.brands.length > 0 ? (
            <BrandDetailsDialog brandDetails={userProfileData.brands[0]} />
          ) : null
        )}

        {renderStep(
          4,
          <FileCheck />,
          'Xác thực thông tin',
          (() => {
            if (brandStatus === BrandStatusEnum.PENDING_REVIEW) {
              return <p className='text-sm text-amber-500'>Đang chờ xét duyệt</p>
            }
            if (brandStatus === BrandStatusEnum.NEED_ADDITIONAL_DOCUMENTS) {
              return <p className='text-sm text-red-500'>Cần bổ sung hồ sơ</p>
            }
            if (brandStatus === BrandStatusEnum.PRE_APPROVED_FOR_MEETING || brandStatus === BrandStatusEnum.ACTIVE) {
              return <p className='text-sm text-primary'>Hoàn thành!</p>
            }
            return (
              <p className='text-sm text-muted-foreground'>
                {hasBrands ? 'Đang xét duyệt hồ sơ' : 'Đăng ký thương hiệu trước'}
              </p>
            )
          })(),
          brandStatus === BrandStatusEnum.PRE_APPROVED_FOR_MEETING || brandStatus === BrandStatusEnum.ACTIVE
        )}

        {renderStep(
          5,
          <Calendar />,
          'Đặt lịch phỏng vấn',
          isBookingLoading ? (
            <p className='text-sm text-muted-foreground'>Đang tải...</p>
          ) : isInterviewSlotSelected ? (
            <p className='text-sm text-primary'>
              {bookingData.data === BookingStatusEnum.WAIT_FOR_CONFIRMATION && 'Chờ xác nhận!'}
              {bookingData.data === BookingStatusEnum.BOOKING_CONFIRMED && 'Đã xác nhận!'}
              {bookingData.data === BookingStatusEnum.COMPLETED && 'Hoàn thành!'}
              {bookingData.data === BookingStatusEnum.CANCELLED && 'Đã hủy!'}
              {!bookingData.data && 'Hoàn thành!'}
            </p>
          ) : (
            <p className='text-sm text-muted-foreground'>
              {hasBrands && brandStatus === BrandStatusEnum.PRE_APPROVED_FOR_MEETING
                ? 'Vui lòng chọn lịch phỏng vấn'
                : 'Chờ xét duyệt hồ sơ'}
            </p>
          ),
          isInterviewSlotSelected,
          () => {
            if (hasBrands && brandStatus === BrandStatusEnum.PRE_APPROVED_FOR_MEETING && !isInterviewSlotSelected) {
              navigate(routesConfig[Routes.SELECT_INTERVIEW_SLOT].path)
            }
          },
          isInterviewSlotSelected ? (
            <BookingDetailsDialog
              bookingDetails={{
                voucherDiscount: 0,
                id: 'a7b383cf-732c-41a1-80f4-aca94f48c98e',
                createdAt: '2025-03-08T03:47:39.809Z',
                updatedAt: '2025-03-08T03:48:49.529Z',
                totalPrice: 0,
                startTime: '2025-03-20T03:00:00.000Z',
                endTime: '2025-03-20T04:00:00.000Z',
                paymentMethod: 'BANK_TRANSFER',
                notes: 'hello',
                meetUrl: 'http://localhost:5173/room/8qtn3341741405659645?type=one-on-one',
                record: null,
                type: 'INTERVIEW',
                status: 'BOOKING_CONFIRMED',
                resultNote: null
              }}
            />
          ) : null
        )}

        {renderStep(
          6,
          <ThumbsUp />,
          'Đăng ký thành công',
          isRegistrationComplete ? (
            <p className='text-sm text-primary'>Hoàn thành!</p>
          ) : (
            <p className='text-sm text-muted-foreground'>
              {isInterviewSlotSelected ? 'Chờ xác nhận' : 'Đặt lịch phỏng vấn trước'}
            </p>
          ),
          isRegistrationComplete
        )}
      </div>
    </>
  )
}

export default RegisterProcess
