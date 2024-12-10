import { useQuery } from '@tanstack/react-query'

import RegisterProcess from '@/components/branch/register-process'
import { getUserProfileApi } from '@/network/apis/user'

export default () => {
  const { data } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn
  })
  const userProfileData = data?.data

  return (
    <div className='w-full max-w-5xl mx-auto p-4'>
      <RegisterProcess userProfileData={userProfileData} />
    </div>
  )
}
