import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'

import CardSection from '@/components/card-section'
import SummeryItem from '@/components/summary/summary-item'
import { getUserProfileApi } from '@/network/apis/user'

const ProfileSummary = () => {
  const { data } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn
  })
  const userProfileData = data?.data
  return (
    <CardSection
      title='Profile Summary'
      description='
     Summary of your profile details, this information will be displayed on your profile'
    >
      <div className='grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 gap-2'>
        <SummeryItem
          label='Display Name'
          value={
            userProfileData?.firstName || userProfileData?.lastName
              ? userProfileData?.firstName + ' ' + userProfileData?.lastName
              : undefined
          }
        />
        <SummeryItem label='User Name' value={userProfileData?.username} />
        <SummeryItem label='Email Address' value={userProfileData?.email} />
        <SummeryItem label='Phone Number' value={userProfileData?.phone} />
        <SummeryItem
          label='Date of Birth'
          value={userProfileData?.dob && format(new Date(userProfileData?.dob), 'PPP')}
        />
        <SummeryItem label='User Gender' value={userProfileData?.gender} />
        <SummeryItem label='Current Role' value={userProfileData?.role} />
      </div>
    </CardSection>
  )
}

export default ProfileSummary
