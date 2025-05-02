import { useQuery } from '@tanstack/react-query'
import { ArrowDownCircle, ArrowUpCircle, Banknote, Landmark } from 'lucide-react'
import { BsWallet } from 'react-icons/bs'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import WalletSection from '@/components/WalletSection'
import { getFinancialSummary } from '@/network/apis/transaction'
import { useStore } from '@/stores/store'
import { formatCurrency } from '@/utils/number'

type Props = {
  specifiedAccountId?: string
}

const WalletOverView = ({ specifiedAccountId }: Props) => {
  const { user } = useStore()
  const accountIdToFetch = specifiedAccountId || user?.id

  const { data: summaryData, isLoading: isLoadingSummary } = useQuery({
    queryKey: [getFinancialSummary.queryKey, { accountId: accountIdToFetch || '' }],
    queryFn: getFinancialSummary.fn,
    enabled: !!accountIdToFetch
  })

  const financialSummary = summaryData?.data

  return (
    <div className='flex flex-col gap-4'>
      {/* Conditionally render WalletSection based on if it's the logged-in user's profile */}
      {user?.id === accountIdToFetch && <WalletSection />}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BsWallet />
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingSummary ? (
            <div className='grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-4'>
              <Skeleton className='h-[88px] w-full' />
              <Skeleton className='h-[88px] w-full' />
              <Skeleton className='h-[88px] w-full' />
              <Skeleton className='h-[88px] w-full' />
            </div>
          ) : financialSummary ? (
            <div className='grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-4'>
              {/* Total Deposit */}
              <div className='flex items-start w-full p-3 space-x-4 transition-colors border border-green-500/20 rounded-lg bg-green-500/5 hover:bg-green-500/10'>
                <div className='p-2 rounded-full shrink-0 bg-green-500/20'>
                  <ArrowDownCircle className='w-4 h-4 text-green-500' />
                </div>
                <div className='flex-1 min-w-0 overflow-hidden'>
                  <p className='text-sm font-medium truncate text-muted-foreground'>Total Deposit</p>
                  <span className='text-lg font-bold text-green-500 truncate md:text-xl'>
                    {formatCurrency(financialSummary.totalAmountFromDeposit || 0, 'vi-VN')}
                  </span>
                </div>
              </div>

              {/* Total Withdrawal */}
              <div className='flex items-start w-full p-3 space-x-4 transition-colors border border-red-500/20 rounded-lg bg-red-500/5 hover:bg-red-500/10'>
                <div className='p-2 rounded-full shrink-0 bg-red-500/20'>
                  <ArrowUpCircle className='w-4 h-4 text-red-500' />
                </div>
                <div className='flex-1 min-w-0 overflow-hidden'>
                  <p className='text-sm font-medium truncate text-muted-foreground'>Total Withdrawal</p>
                  <span className='text-lg font-bold text-red-500 truncate md:text-xl'>
                    {formatCurrency(financialSummary.totalAmountFromWithDrawal || 0, 'vi-VN')}
                  </span>
                </div>
              </div>

              {/* Balance */}
              <div className='flex items-start w-full p-3 space-x-4 transition-colors border border-blue-500/20 rounded-lg bg-blue-500/5 hover:bg-blue-500/10'>
                <div className='p-2 rounded-full shrink-0 bg-blue-500/20'>
                  <Landmark className='w-4 h-4 text-blue-500' />
                </div>
                <div className='flex-1 min-w-0 overflow-hidden'>
                  <p className='text-sm font-medium truncate text-muted-foreground'>Balance</p>
                  <span className='text-lg font-bold text-blue-500 truncate md:text-xl'>
                    {formatCurrency(financialSummary.balance || 0, 'vi-VN')}
                  </span>
                </div>
              </div>

              {/* Available Balance */}
              <div className='flex items-start w-full p-3 space-x-4 transition-colors border border-purple-500/20 rounded-lg bg-purple-500/5 hover:bg-purple-500/10'>
                <div className='p-2 rounded-full shrink-0 bg-purple-500/20'>
                  <Banknote className='w-4 h-4 text-purple-500' />
                </div>
                <div className='flex-1 min-w-0 overflow-hidden'>
                  <p className='text-sm font-medium truncate text-muted-foreground'>Available Balance</p>
                  <span className='text-lg font-bold truncate text-purple-500 md:text-xl'>
                    {formatCurrency(financialSummary.availableBalance || 0, 'vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className='flex justify-center p-6'>
              <p className='text-muted-foreground'>Could not load financial summary.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default WalletOverView
