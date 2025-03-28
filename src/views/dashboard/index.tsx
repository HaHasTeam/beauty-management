import { useQuery } from '@tanstack/react-query'

import RegisterProcess from '@/components/branch/register-process'
import { getUserProfileApi } from '@/network/apis/user'
import { TUser } from '@/types/user'

export default () => {
  const { data: userProfileData } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn,
    select: (data) => data.data
  })

  return (
    <div className='w-full max-w-7xl mx-auto '>
      <RegisterProcess userProfileData={userProfileData as unknown as TUser} />
    </div>
  )
}
