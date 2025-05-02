import { Briefcase, Clock, LockKeyhole, User, Wallet2 } from 'lucide-react'
import { parseAsString, useQueryState } from 'nuqs'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useStore } from '@/stores/store'
import { RoleEnum } from '@/types/enum'

import ChangePassword from './ChangePassword'
import ProfileDetails from './ProfileDetails'
import Wallet from './wallet'
import WorkingProfile from './WorkingProfile'
import WorkingTimeTab from './WorkingTimeTab'

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useQueryState('activeTab', parseAsString.withDefault('profile'))
  const { user } = useStore()
  const role = user?.role as RoleEnum

  return (
    <div className='relative flex w-full flex-col md:pt-[unset]'>
      <div className='max-w-full mx-auto w-full flex-col justify-center gap-8 flex'>
        <div className='w-full flex flex-col gap-8'>
          <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
            <TabsList className='w-fit'>
              <TabsTrigger value='profile' className='flex items-center gap-2'>
                <User className='h-4 w-4' />
                Profile Details
              </TabsTrigger>
              {[RoleEnum.CONSULTANT].includes(role) && (
                <TabsTrigger value='workingprofile' className='flex items-center gap-2'>
                  <Briefcase className='h-4 w-4' />
                  Working Profile
                </TabsTrigger>
              )}
              {[RoleEnum.CONSULTANT, RoleEnum.OPERATOR].includes(role) && (
                <TabsTrigger value='workingtime' className='flex items-center gap-2'>
                  <Clock className='h-4 w-4' />
                  Working Time
                </TabsTrigger>
              )}
              {[RoleEnum.CONSULTANT, RoleEnum.ADMIN, RoleEnum.OPERATOR, RoleEnum.MANAGER].includes(role) && (
                <TabsTrigger value='wallet' className='flex items-center gap-2'>
                  <Wallet2 className='h-4 w-4' />
                  Transactions & Requests
                </TabsTrigger>
              )}
              <TabsTrigger value='password' className='flex items-center gap-2'>
                <LockKeyhole className='h-4 w-4' />
                Change Password
              </TabsTrigger>
            </TabsList>

            <TabsContent value='profile' className='pt-6'>
              <ProfileDetails />
            </TabsContent>

            <TabsContent value='password' className='pt-6'>
              <ChangePassword />
            </TabsContent>

            <TabsContent value='workingprofile' className='pt-6'>
              <WorkingProfile />
            </TabsContent>

            <TabsContent value='workingtime' className='pt-6'>
              <WorkingTimeTab />
            </TabsContent>

            <TabsContent value='wallet' className='pt-6'>
              <Wallet />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings
