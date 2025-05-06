import { useQuery } from '@tanstack/react-query'

import RegisterProcess, { useUserStatus } from '@/components/branch/register-process'
import BookingStatistics from '@/components/ui/transaction-statics/booking'
import BrandRecommendStatic from '@/components/ui/transaction-statics/brand-recommend'
import OrderStatics from '@/components/ui/transaction-statics/order'
import RevenueStatics from '@/components/ui/transaction-statics/revenue'
import SystemStatic from '@/components/ui/transaction-statics/system'
import { getUserProfileApi } from '@/network/apis/user'
import { useStore } from '@/stores/store'
import { RoleEnum } from '@/types/enum'
import { TUser, UserStatusEnum } from '@/types/user'

export default () => {
  const { data: userProfileData } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn,
    select: (data) => data.data
  })
  const userStatus = useUserStatus(userProfileData as unknown as TUser)
  const { user } = useStore()
  const isManagerCompleted = userProfileData ? userStatus.isRegistrationComplete : false

  const isAdmin = [RoleEnum.ADMIN, RoleEnum.OPERATOR].includes(user?.role as RoleEnum)
  const isManager = [RoleEnum.MANAGER].includes(user?.role as RoleEnum)
  const isWithdrawable = [RoleEnum.CONSULTANT, RoleEnum.MANAGER, RoleEnum.STAFF].includes(user?.role as RoleEnum)
  const isBrand = [RoleEnum.MANAGER, RoleEnum.STAFF].includes(user?.role as RoleEnum)
  const isConsultant = [RoleEnum.CONSULTANT].includes(user?.role as RoleEnum)
  const shouldShowStatics = (isManager && isManagerCompleted) || user?.status === UserStatusEnum.ACTIVE
  return (
    <div className='w-full space-y-12'>
      {shouldShowStatics && (
        <>
          {isWithdrawable && <RevenueStatics header='Overall Statistics' showWalletOverview={true} />}
          {isAdmin && <SystemStatic />}
          {isAdmin && (
            <div className='flex flex-col gap-10 lg:flex-row'>
              <div className='flex-1'>
                <OrderStatics mode='mini' isAdminMini />
              </div>
              <div className='flex-1'>
                <BookingStatistics mode='mini' isAdminMini />
              </div>
            </div>
          )}
          {isBrand && <OrderStatics />}
          {isConsultant && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch'>
              <div className='flex-1 h-full'>
                <BookingStatistics mode='mini' />
              </div>
              <div className='flex-1 h-full'>
                <BrandRecommendStatic />
              </div>
            </div>
          )}
          {isManager && <RegisterProcess userProfileData={userProfileData as unknown as TUser} />}
        </>
      )}
    </div>
  )
}
