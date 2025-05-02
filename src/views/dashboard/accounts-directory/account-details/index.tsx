import { useQuery } from '@tanstack/react-query'
import { CircleDashed } from 'lucide-react'
import * as React from 'react'
import { useParams } from 'react-router-dom'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getAccountDetailsByIdApi } from '@/network/apis/user'

import Wallet from '../../profile-settings/wallet'
import AccountDetailsHeader from './AccountDetailsHeader'
import AddressesTab from './AddressesTab'
import BankAccountsTab from './BankAccountsTab'
import PersonalDetailsTab from './PersonalDetailsTab'
import WorkingProfileTab from './WorkingProfileTab'
import WorkingTimeTab from './WorkingTimeTab'

const AccountDetails = () => {
  const { id = '' } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = React.useState('personal')

  const { data: accountData, isLoading } = useQuery({
    queryKey: [getAccountDetailsByIdApi.queryKey, id],
    queryFn: getAccountDetailsByIdApi.fn,
    enabled: !!id
  })

  const account = accountData?.data

  // Check if the user is a consultant
  const isConsultant = React.useMemo(() => {
    if (!account) return false

    // Handle both string and object role types
    const roleValue = typeof account.role === 'string' ? account.role : account.role?.role

    return roleValue === 'CONSULTANT'
  }, [account])

  const isOperator = React.useMemo(() => {
    if (!account) return false

    // Handle both string and object role types
    const roleValue = typeof account.role === 'string' ? account.role : account.role?.role

    return roleValue === 'OPERATOR'
  }, [account])

  if (isLoading && !account) {
    return (
      <div className='flex justify-center items-center h-[400px]'>
        <div className='text-center'>
          <CircleDashed className='h-16 w-16 animate-spin text-primary mx-auto' />
          <p className='mt-4 text-muted-foreground'>Loading account details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <AccountDetailsHeader account={account} isLoading={isLoading} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-4'>
        <TabsList className='w-fit grid-cols-2 md:grid-cols-5 lg:w-auto'>
          <TabsTrigger value='personal'>Personal Information</TabsTrigger>
          <TabsTrigger value='addresses'>Addresses</TabsTrigger>
          <TabsTrigger value='bank-accounts'>Bank Accounts</TabsTrigger>
          <TabsTrigger value='wallet'>Transactions & Requests</TabsTrigger>
          {(isConsultant || isOperator) && <TabsTrigger value='working-time'>Working Schedule</TabsTrigger>}
          {isConsultant && <TabsTrigger value='working-profile'>Working Profile</TabsTrigger>}
        </TabsList>

        <TabsContent value='personal' className='space-y-4'>
          <PersonalDetailsTab account={account} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value='addresses' className='space-y-4'>
          <AddressesTab account={account} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value='bank-accounts' className='space-y-4'>
          <BankAccountsTab account={account} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value='wallet' className='space-y-4'>
          <Wallet specifiedAccountId={id} />
        </TabsContent>

        {(isConsultant || isOperator) && (
          <TabsContent value='working-time' className='space-y-4'>
            <WorkingTimeTab accountId={id} />
          </TabsContent>
        )}

        <TabsContent value='working-profile' className='space-y-4'>
          <WorkingProfileTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AccountDetails
