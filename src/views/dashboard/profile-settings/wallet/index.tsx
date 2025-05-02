import { useQuery } from '@tanstack/react-query'
import { Wallet2 } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getAccountDetailsByIdApi } from '@/network/apis/user'
import { useStore } from '@/stores/store'
import { RoleEnum } from '@/types/enum'

import TransactionManagementPage from '../../transaction-management'
import WalletOverView from './WalletOverView'

type Props = {
  specifiedAccountId?: string
}

const Wallet = ({ specifiedAccountId }: Props) => {
  const { user } = useStore()
  specifiedAccountId = specifiedAccountId ?? user?.id
  const { data: accountDetails, isLoading: isLoadingAccountDetails } = useQuery({
    queryKey: [getAccountDetailsByIdApi.queryKey, specifiedAccountId as string],
    queryFn: getAccountDetailsByIdApi.fn,
    enabled: !!specifiedAccountId
  })

  const shouldShowOverview =
    !isLoadingAccountDetails &&
    [RoleEnum.CUSTOMER, RoleEnum.CONSULTANT, RoleEnum.MANAGER].includes((accountDetails?.data?.role || '') as RoleEnum)

  const showTransaction = [RoleEnum.CUSTOMER, RoleEnum.CONSULTANT, RoleEnum.MANAGER].includes(
    (accountDetails?.data?.role || '') as RoleEnum
  )
  return (
    <div className='flex flex-col gap-4'>
      {isLoadingAccountDetails ? (
        <Skeleton className='h-[150px] w-full' />
      ) : (
        shouldShowOverview && <WalletOverView specifiedAccountId={specifiedAccountId} />
      )}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Wallet2 />
            Transactions & Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionManagementPage specifiedAccountId={specifiedAccountId} showTransaction={showTransaction} />
        </CardContent>
      </Card>
    </div>
  )
}

export default Wallet
