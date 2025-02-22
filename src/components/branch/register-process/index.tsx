'use client'

import { Calendar, CircleCheckBig, ShieldCheck, Store, User } from 'lucide-react'
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
    isBrandVerify,
    isRegisterBrand,
    isInterviewSlotSelected,
    hasBrands,
    isAdminOrOperator,
    completionPercentage
  } = useMemo(() => {
    let isEmailVerify = false
    let isBrandVerify = false
    let isRegisterBrand = false
    let isInterviewSlotSelected = false
    let hasBrands = false
    let isAdminOrOperator = false

    if (userProfileData) {
      isAdminOrOperator = userProfileData.role === RoleEnum.ADMIN || userProfileData.role === RoleEnum.OPERATOR

      if (userProfileData.brands && userProfileData.brands.length > 0) {
        isRegisterBrand = true
        hasBrands = true
        if (userProfileData.brands[0].status === BrandStatusEnum.ACTIVE) {
          isBrandVerify = true
          isInterviewSlotSelected = true
        }
      }
      if (userProfileData.isEmailVerify) {
        isEmailVerify = true
      }
    }

    // Calculate completion percentage
    const totalSteps = 5
    let currentStep = 1
    if (isEmailVerify) currentStep++
    if (isRegisterBrand) currentStep++
    if (isInterviewSlotSelected) currentStep++
    if (isBrandVerify) currentStep++
    const completionPercentage = Math.round((currentStep / totalSteps) * 100)

    return {
      isEmailVerify,
      isBrandVerify,
      isRegisterBrand,
      isInterviewSlotSelected,
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

      <div className='grid grid-cols-1 md:grid-cols-5 gap-4 relative'>
        <Card className="bg-primary/10 shadow-sm after:-right-4 after:absolute after:top-1/2 p-4 relative z-10 after:inline-block after:h-0 after:w-4 after:border-2 after:border-b after:border-primary after:content-['']">
          <User className='w-8 h-8 text-primary mb-3' />
          <h3 className='font-medium mb-1'>Đăng ký tài khoản</h3>
          <p className='text-sm text-primary'>Hoàn thành!</p>
        </Card>
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
        <Card
          onClick={() => {
            if (isEmailVerify) {
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
        <Card
          onClick={() => {
            if (hasBrands) {
              navigate(routesConfig[Routes.SELECT_INTERVIEW_SLOT].path)
            }
          }}
          className={cn(
            isInterviewSlotSelected && 'bg-primary/10 after:border-primary',
            hasBrands && !isInterviewSlotSelected && 'cursor-pointer',
            !hasBrands && 'opacity-50',
            "shadow-sm after:-right-4 after:absolute after:top-1/2 p-4 relative z-10 after:inline-block after:h-0 after:w-4 after:border-2 after:border-b after:content-['']"
          )}
        >
          <Calendar className={cn(isInterviewSlotSelected && 'text-primary', 'w-8 h-8 mb-3')} />
          <h3 className='font-medium mb-1'>Chọn lịch phỏng vấn</h3>
          {isInterviewSlotSelected ? (
            <p className='text-sm text-primary'>Hoàn thành!</p>
          ) : (
            <p className='text-sm text-muted-foreground'>
              {hasBrands ? 'Vui lòng chọn lịch phỏng vấn' : 'Đăng ký thương hiệu trước'}
            </p>
          )}
        </Card>
        <Card
          className={cn(
            isBrandVerify && 'bg-primary/10 after:border-primary',
            !hasBrands && 'opacity-50',
            "shadow-sm after:-right-4 after:absolute after:top-1/2 p-4 relative z-10 after:inline-block after:h-0 after:w-4 after:content-['']"
          )}
        >
          <CircleCheckBig className={cn(isBrandVerify && 'text-primary', 'w-8 h-8 mb-3')} />
          <h3 className='font-medium mb-1'>Kiểm duyệt hồ sơ đăng ký</h3>
          {isBrandVerify ? (
            <p className='text-sm text-primary'>Hoàn thành!</p>
          ) : (
            <p className='text-sm text-muted-foreground'>
              {hasBrands ? 'Xác thực thông tin thương hiệu' : 'Đăng ký thương hiệu trước'}
            </p>
          )}
        </Card>
      </div>
    </>
  )
}

export default RegisterProcess
