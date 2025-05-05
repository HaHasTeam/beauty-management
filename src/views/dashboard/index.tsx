import { useQuery } from '@tanstack/react-query'

import RegisterProcess from '@/components/branch/register-process'
import SystemStatic from '@/components/ui/transaction-statics/system'
import { getUserProfileApi } from '@/network/apis/user'
import { useStore } from '@/stores/store'
import { RoleEnum } from '@/types/enum'
import { TUser } from '@/types/user'

export default () => {
  const { data: userProfileData } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn,
    select: (data) => data.data
  })
  const { user } = useStore()
  const isAdmin = [RoleEnum.ADMIN, RoleEnum.OPERATOR].includes(user?.role as RoleEnum)
  const isManager = [RoleEnum.MANAGER].includes(user?.role as RoleEnum)
  return (
    <div className='w-full'>
      {isAdmin && <SystemStatic />}
      {isManager && <RegisterProcess userProfileData={userProfileData as unknown as TUser} />}
    </div>
  )
}
