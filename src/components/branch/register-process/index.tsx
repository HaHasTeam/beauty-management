import { Calendar, FileCheck, ShieldCheck, Store, ThumbsUp, User } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { Card } from '@/components/ui/card'
import { Routes, routesConfig } from '@/configs/routes'
import { cn } from '@/lib/utils'
import { BrandStatusEnum } from '@/types/brand'
import { RoleEnum } from '@/types/enum'
import type { TUser } from '@/types/user'

function RegisterProcess({ userProfileData }: { userProfileData?: TUser }) {
  const navigate = useNavigate()

  const {
    isEmailVerify,
    brandStatus,
    isRegisterBrand,
    isInterviewSlotSelected,
    isRegistrationComplete,
    hasBrands,
    isAdminOrOperator,
    completionPercentage
  } = useMemo(() => {
    let isEmailVerify = false
    let brandStatus: BrandStatusEnum | 'ACTIVE' | null = null
    let isRegisterBrand = false
    let isInterviewSlotSelected = false
    let isRegistrationComplete = false
    let hasBrands = false
    let isAdminOrOperator = false

    if (userProfileData) {
      isAdminOrOperator = userProfileData.role === RoleEnum.ADMIN || userProfileData.role === RoleEnum.OPERATOR

      if (userProfileData.brands && userProfileData.brands.length > 0) {
        isRegisterBrand = true
        hasBrands = true

        // Get brand status
        brandStatus = userProfileData.brands[0].status

        // Check if interview slot is selected (PRE_APPROVED_FOR_MEETING means they've booked a meeting)
        isInterviewSlotSelected = brandStatus === BrandStatusEnum.PRE_APPROVED_FOR_MEETING

        // Check if registration is complete (ACTIVE status)
        isRegistrationComplete = brandStatus === 'ACTIVE'
      }

      if (userProfileData.isEmailVerify) {
        isEmailVerify = true
      }
    }

    // Calculate completion percentage
    const totalSteps = 6
    let completedSteps = 0

    // Step 1: Register account is always completed if we have user data
    completedSteps++

    // Step 2: Activate account
    if (isEmailVerify) completedSteps++

    // Step 3: Register brand
    if (isRegisterBrand) completedSteps++

    // Step 4: Verify information
    if (brandStatus === BrandStatusEnum.PRE_APPROVED_FOR_MEETING || brandStatus === 'ACTIVE') completedSteps++

    // Step 5: Booking meeting
    if (isInterviewSlotSelected) completedSteps++

    // Step 6: Registration complete
    if (isRegistrationComplete) completedSteps++

    const completionPercentage = Math.round((completedSteps / totalSteps) * 100)

    return {
      isEmailVerify,
      brandStatus,
      isRegisterBrand,
      isInterviewSlotSelected,
      isRegistrationComplete,
      hasBrands,
      isAdminOrOperator,
      completionPercentage
    }
  }, [userProfileData])

  // Early return if conditions are not met
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
      <div className='mb-6 flex items-center gap-2'>
        <h2 className='text-xl font-semibold'>Hồ sơ nhà bán đã hoàn thành</h2>
        <span className='bg-primary text-white px-2 py-0.5 rounded text-sm font-medium'>{completionPercentage}%</span>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-6 gap-4 relative'>
        {/* Step 1: Register account */}
        <Card className="bg-primary/10 shadow-sm after:-right-4 after:absolute after:top-1/2 p-4 relative z-10 after:inline-block after:h-0 after:w-4 after:border-2 after:border-b after:border-primary after:content-['']">
          <User className='w-8 h-8 text-primary mb-3' />
          <h3 className='font-medium mb-1'>Đăng ký tài khoản</h3>
          <p className='text-sm text-primary'>Hoàn thành!</p>
        </Card>

        {/* Step 2: Activate account */}
        <Card
          className={cn(
            isEmailVerify && 'bg-primary/10 after:border-primary',
            "shadow-sm after:-right-4 after:absolute after:top-1/2 p-4 relative z-10 after:inline-block after:h-0 after:w-4 after:border-2 after:border-b after:content-['']"
          )}
        >
          <ShieldCheck className={cn(isEmailVerify && 'text-primary', 'w-8 h-8 mb-3')} />
          <h3 className='font-medium mb-1'>Kích hoạt tài khoản</h3>
          {isEmailVerify ? (
            <p className='text-sm text-primary'>Hoàn thành!</p>
          ) : (
            <p className='text-sm text-muted-foreground'>
              Vui lòng xác thực tài khoản email{' '}
              <a className='cursor-pointer' href='https://mail.google.com/mail/u/0/#inbox'>
                <span className='text-sm p-1 px-2 text-primary'>link</span>
              </a>
            </p>
          )}
        </Card>

        {/* Step 3: Register brand */}
        <Card
          onClick={() => {
            if (isEmailVerify && !isRegisterBrand) {
              navigate(routesConfig[Routes.REGISTER_BRAND].path)
            }
          }}
          className={cn(
            isRegisterBrand && 'bg-primary/10 after:border-primary',
            isEmailVerify && !isRegisterBrand && 'cursor-pointer',
            !isEmailVerify && 'opacity-50',
            "shadow-sm after:-right-4 after:absolute after:top-1/2 p-4 relative z-10 after:inline-block after:h-0 after:w-4 after:border-2 after:border-b after:content-['']"
          )}
        >
          <Store className={cn(isRegisterBrand && 'text-primary', 'w-8 h-8 mb-3')} />
          <h3 className='font-medium mb-1'>Đăng ký Thương hiệu</h3>
          {isRegisterBrand ? (
            <p className='text-sm text-primary'>Hoàn thành!</p>
          ) : (
            <p className='text-sm text-muted-foreground'>
              {isEmailVerify ? 'Vui lòng cung cấp thông tin' : 'Kích hoạt tài khoản trước'}
            </p>
          )}
        </Card>

        {/* Step 4: Verify information */}
        <Card
          className={cn(
            (brandStatus === BrandStatusEnum.PRE_APPROVED_FOR_MEETING || brandStatus === 'ACTIVE') &&
              'bg-primary/10 after:border-primary',
            !hasBrands && 'opacity-50',
            "shadow-sm after:-right-4 after:absolute after:top-1/2 p-4 relative z-10 after:inline-block after:h-0 after:w-4 after:border-2 after:border-b after:content-['']"
          )}
        >
          <FileCheck
            className={cn(
              (brandStatus === BrandStatusEnum.PRE_APPROVED_FOR_MEETING || brandStatus === 'ACTIVE') && 'text-primary',
              'w-8 h-8 mb-3'
            )}
          />
          <h3 className='font-medium mb-1'>Xác thực thông tin</h3>
          {brandStatus === BrandStatusEnum.PENDING_REVIEW && (
            <p className='text-sm text-amber-500'>Đang chờ xét duyệt</p>
          )}
          {brandStatus === BrandStatusEnum.NEED_ADDITIONAL_DOCUMENTS && (
            <p className='text-sm text-red-500'>Cần bổ sung hồ sơ</p>
          )}
          {brandStatus === BrandStatusEnum.PRE_APPROVED_FOR_MEETING || brandStatus === 'ACTIVE' ? (
            <p className='text-sm text-primary'>Hoàn thành!</p>
          ) : (
            <p className='text-sm text-muted-foreground'>
              {hasBrands ? 'Đang xét duyệt hồ sơ' : 'Đăng ký thương hiệu trước'}
            </p>
          )}
        </Card>

        {/* Step 5: Booking meeting */}
        <Card
          onClick={() => {
            if (hasBrands && brandStatus === BrandStatusEnum.PRE_APPROVED_FOR_MEETING && !isInterviewSlotSelected) {
              navigate(routesConfig[Routes.SELECT_INTERVIEW_SLOT].path)
            }
          }}
          className={cn(
            isInterviewSlotSelected && 'bg-primary/10 after:border-primary',
            hasBrands &&
              brandStatus === BrandStatusEnum.PRE_APPROVED_FOR_MEETING &&
              !isInterviewSlotSelected &&
              'cursor-pointer',
            (!hasBrands || brandStatus !== BrandStatusEnum.PRE_APPROVED_FOR_MEETING) &&
              !isInterviewSlotSelected &&
              'opacity-50',
            "shadow-sm after:-right-4 after:absolute after:top-1/2 p-4 relative z-10 after:inline-block after:h-0 after:w-4 after:border-2 after:border-b after:content-['']"
          )}
        >
          <Calendar className={cn(isInterviewSlotSelected && 'text-primary', 'w-8 h-8 mb-3')} />
          <h3 className='font-medium mb-1'>Đặt lịch phỏng vấn</h3>
          {isInterviewSlotSelected ? (
            <p className='text-sm text-primary'>Hoàn thành!</p>
          ) : (
            <p className='text-sm text-muted-foreground'>
              {hasBrands && brandStatus === BrandStatusEnum.PRE_APPROVED_FOR_MEETING
                ? 'Vui lòng chọn lịch phỏng vấn'
                : 'Chờ xét duyệt hồ sơ'}
            </p>
          )}
        </Card>

        {/* Step 6: Registration complete */}
        <Card
          className={cn(
            isRegistrationComplete && 'bg-primary/10',
            !isInterviewSlotSelected && 'opacity-50',
            'shadow-sm p-4 relative z-10'
          )}
        >
          <ThumbsUp className={cn(isRegistrationComplete && 'text-primary', 'w-8 h-8 mb-3')} />
          <h3 className='font-medium mb-1'>Đăng ký thành công</h3>
          {isRegistrationComplete ? (
            <p className='text-sm text-primary'>Hoàn thành!</p>
          ) : (
            <p className='text-sm text-muted-foreground'>
              {isInterviewSlotSelected ? 'Chờ xác nhận' : 'Đặt lịch phỏng vấn trước'}
            </p>
          )}
        </Card>
      </div>
    </>
  )
}

export default RegisterProcess
