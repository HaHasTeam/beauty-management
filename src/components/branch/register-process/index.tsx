import { CircleCheckBig, ShieldCheck, Store, User } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { Card } from '@/components/ui/card'
import { Routes, routesConfig } from '@/configs/routes'
import { cn } from '@/lib/utils'
import { BrandStatusEnum } from '@/types/brand'
import { RoleEnum } from '@/types/enum'
import { TUser } from '@/types/user'

function RegisterProcess({ userProfileData }: { userProfileData?: TUser }) {
  const navigate = useNavigate()
  const { isEmailVerify, isBrandVerify, isRegisterBrand } = useMemo(() => {
    let isEmailVerify = false,
      isBrandVerify = false,
      isRegisterBrand = false
    if (userProfileData?.brands && userProfileData?.brands?.length > 0) {
      isRegisterBrand = true
      if (userProfileData.brands[0].status === BrandStatusEnum.ACTIVE) {
        isBrandVerify = true
      }
    }
    if (userProfileData && userProfileData.isEmailVerify) {
      isEmailVerify = true
    }

    return {
      isEmailVerify,
      isRegisterBrand,
      isBrandVerify
    }
  }, [userProfileData])
  function calculateCompletionPercentage({
    isEmailVerify,
    isRegisterBrand,
    isBrandVerify
  }: {
    isEmailVerify: boolean
    isRegisterBrand: boolean
    isBrandVerify: boolean
  }): number {
    // Define the total number of steps
    const totalSteps = 4

    // Calculate the current step based on the status of each variable
    let currentStep = 1

    if (isEmailVerify) currentStep++ // Step 1: Email verified
    if (isRegisterBrand) currentStep++ // Step 2: Brand registered
    if (isBrandVerify) currentStep++ // Step 3: Brand verified

    // Add steps for remaining process
    // if (isEmailVerify && isRegisterBrand) currentStep++ // Step 4: Confirmed brand registration
    // if (isEmailVerify && isRegisterBrand && isBrandVerify) currentStep++ // Step 5: Process completed

    // Calculate percentage
    return Math.round((currentStep / totalSteps) * 100)
  }

  // Example Usage
  const completionPercentage = calculateCompletionPercentage({
    isEmailVerify: isEmailVerify,
    isRegisterBrand: isRegisterBrand,
    isBrandVerify: isBrandVerify
  })
  return (
    <>
      {completionPercentage == 100 || !(userProfileData?.role === RoleEnum.MANAGER) ? (
        <></>
      ) : (
        <>
          <div className='mb-6 flex items-center gap-2'>
            <h2 className='text-xl font-semibold'>Hồ sơ nhà bán đã hoàn thành</h2>
            <span className='bg-primary text-white px-2 py-0.5 rounded text-sm font-medium'>
              {completionPercentage}%
            </span>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 relative'>
            {/* <div className='hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary -translate-y-1/2 -z-1' /> */}

            <Card
              // className='relative p-4'
              className={
                " bg-primary/10 shadow-sm after:-right-4 after:absolute after:top-1/2  p-4 relative z-10 after:inline-block after:h-0 after:w-4 after:border-2 after:border-b after:border-primary after:content-['']  "
              }
            >
              {/* <div className='absolute top-1/2 -right-5 h-0.5 border border-1 w-5 z-0  bg-primary' /> */}
              <User className='w-8 h-8 text-primary mb-3' />
              <h3 className='font-medium mb-1'>Đăng ký tài khoản</h3>
              <p className='text-sm text-primary'>Hoàn thành!</p>
            </Card>
            <Card
              className={cn(
                isEmailVerify && 'bg-primary/10 after:border-primary',

                "shadow-sm after:-right-4 after:absolute after:top-1/2  p-4 relative z-10 after:inline-block after:h-0 after:w-4 after:border-2 after:border-b  after:content-['']  "
              )}
            >
              <ShieldCheck className={cn(isEmailVerify && 'text-primary', 'w-8 h-8   mb-3')} />

              <h3 className='font-medium mb-1'>Kích hoạt tài khoản</h3>

              {isEmailVerify ? (
                <p className='text-sm text-primary'>Hoàn thành! </p>
              ) : (
                <p className='text-sm text-muted-foreground'>
                  Vui lòng xác thực tài khoản email{' '}
                  <a className=' cursor-pointer ' href='https://mail.google.com/mail/u/0/#inbox'>
                    <span className='text-sm p-1 px-2 text-primary '>link</span>
                  </a>
                </p>
              )}
            </Card>
            <Card
              onClick={() => {
                navigate(routesConfig[Routes.REGISTER_BRAND].path)
              }}
              className={cn(
                isRegisterBrand && 'bg-primary/10 after:border-primary',
                !isRegisterBrand && 'cursor-pointer',
                "shadow-sm after:-right-4 after:absolute after:top-1/2  p-4 relative z-10 after:inline-block after:h-0 after:w-4 after:border-2 after:border-b  after:content-['']  "
              )}
            >
              {/* <div className='absolute top-4 right-4 w-2 h-2 rounded-full bg-primary' /> */}
              <Store className={cn(isEmailVerify && 'text-primary', 'w-8 h-8   mb-3')} />
              <h3 className='font-medium mb-1'>Đăng ký Thương hiệu </h3>
              {isEmailVerify ? (
                <p className='text-sm text-primary'>Hoàn thành! </p>
              ) : (
                <p className='text-sm text-muted-foreground'>Vui lòng cung cấp thông tin</p>
              )}
            </Card>
            <Card
              className={cn(
                isBrandVerify && 'bg-primary/10 after:border-primary',
                "shadow-sm after:-right-4 after:absolute after:top-1/2  p-4 relative z-10 after:inline-block after:h-0 after:w-4    after:content-['']  "
              )}
            >
              {/* <div className='absolute top-4 right-4 w-2 h-2 rounded-full bg-primary' /> */}
              <CircleCheckBig className={cn(isBrandVerify && 'text-primary', 'w-8 h-8   mb-3')} />

              <h3 className='font-medium mb-1'>Kiểm duyệt hồ sơ đăng ký</h3>
              {isBrandVerify ? (
                <p className='text-sm text-primary'>Hoàn thành! </p>
              ) : (
                <p className='text-sm text-muted-foreground'>Xác thực thông tin thương hiệu</p>
              )}
            </Card>
          </div>
        </>
      )}
    </>
  )
}

export default RegisterProcess
