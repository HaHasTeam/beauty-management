import { useQuery } from '@tanstack/react-query'
import { CreditCard } from 'lucide-react'
import * as React from 'react'

import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { getBanksApi } from '@/network/apis/bank'
import { TUserResponse } from '@/network/apis/user/type'
import { TBank } from '@/types/bank'
import { TBankAccount } from '@/types/bank-account'

// Bank account card component
const BankAccountCard = ({ account }: { account: TBankAccount }) => {
  const { data: banksData } = useQuery({
    queryKey: [getBanksApi.queryKey],
    queryFn: getBanksApi.fn,
    staleTime: 1000 * 60 * 60 // Cache for 1 hour
  })

  const banks = banksData?.data || []
  const bankInfo = banks.find(
    (bank: TBank) =>
      bank.name.toLowerCase().includes(account.bankName.toLowerCase()) ||
      bank.shortName.toLowerCase().includes(account.bankName.toLowerCase())
  )

  // Function to mask account number
  const maskAccountNumber = (number: string) => {
    if (!number) return ''
    const last4 = number.slice(-4)
    return `•••• •••• •••• ${last4}`
  }

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all hover:shadow-md group',
        'dark:bg-slate-900 dark:border-slate-800',
        account.isDefault && 'ring-2 ring-primary/30 dark:ring-primary/50'
      )}
    >
      <div
        className={cn(
          'w-full p-6 rounded-lg transition-all',
          'bg-gradient-to-br from-primary/20 to-primary/10',
          'dark:from-primary/40 dark:to-primary/30',
          'group-hover:from-primary/30 group-hover:to-primary/20',
          'dark:group-hover:from-primary/50 dark:group-hover:to-primary/40'
        )}
      >
        <div className='flex justify-between items-start mb-6'>
          <div className='flex items-center gap-2'>
            {bankInfo?.logo ? (
              <div className='p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm'>
                <img src={bankInfo.logo} alt={bankInfo.name} className='h-6 w-auto object-contain' />
              </div>
            ) : (
              <div className='h-10 w-14 bg-white/20 dark:bg-slate-800/50 rounded animate-pulse' />
            )}
            {account.isDefault && (
              <Badge
                variant='outline'
                className='bg-emerald-500/30 text-emerald-500 border-emerald-500/40 hover:bg-emerald-500/40 dark:bg-emerald-500/40 dark:text-emerald-400 dark:border-emerald-500/50 dark:hover:bg-emerald-500/50'
              >
                Default
              </Badge>
            )}
          </div>
          <div className='flex items-center gap-2 text-black dark:text-white'>
            <CreditCard className='h-6 w-6' />
          </div>
        </div>

        <div className='space-y-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-7 rounded bg-white/90 dark:bg-slate-800 grid place-items-center shadow-sm'>
              <svg viewBox='0 0 24 24' className='w-6 h-6 text-primary dark:text-primary/80' fill='currentColor'>
                <path d='M0 0h24v24H0z' fill='none' />
                <path d='M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM4 0h16v2H4zm0 22h16v2H4zm8-10a2.5 2.5 0 000-5 2.5 2.5 0 000 5z' />
              </svg>
            </div>
            <p className='font-mono text-lg tracking-widest text-black dark:text-white font-semibold'>
              {maskAccountNumber(account.accountNumber)}
            </p>
          </div>

          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm text-black/70 dark:text-white/70 font-medium'>Card Holder</p>
              <p className='font-semibold text-black dark:text-white text-lg'>{account.accountName}</p>
            </div>
            <div className='text-right space-y-1'>
              <p className='text-sm text-black/70 dark:text-white/70 font-medium'>Bank</p>
              <p className='font-semibold text-black dark:text-white text-lg'>
                {bankInfo?.shortName || bankInfo?.name || account.bankName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

interface BankAccountsTabProps {
  account?: TUserResponse
  isLoading: boolean
}

const BankAccountsTab: React.FC<BankAccountsTabProps> = ({ account, isLoading }) => {
  if (isLoading) {
    return (
      <Card className='relative dark:bg-slate-900 dark:border-slate-800'>
        <LoadingContentLayer />
        <CardHeader>
          <CardTitle className='dark:text-white'>Bank Accounts</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  if (!account) {
    return (
      <Card className='dark:bg-slate-900 dark:border-slate-800'>
        <CardHeader>
          <CardTitle className='dark:text-white'>Bank Accounts</CardTitle>
        </CardHeader>
        <CardContent className='dark:text-white'>Account not found</CardContent>
      </Card>
    )
  }

  const bankAccounts = account.bankAccounts || []

  if (bankAccounts.length === 0) {
    return (
      <Card className='dark:bg-slate-900 dark:border-slate-800'>
        <CardHeader>
          <CardTitle className='dark:text-white'>Bank Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center py-10 text-center'>
            <div className='rounded-full bg-muted dark:bg-slate-800 p-3 mb-4'>
              <CreditCard className='h-6 w-6 text-muted-foreground dark:text-slate-400' />
            </div>
            <h3 className='text-lg font-medium mb-2 dark:text-white'>No Bank Accounts Found</h3>
            <p className='text-sm text-muted-foreground dark:text-slate-400 max-w-md'>
              This account doesn't have any bank accounts saved yet.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='dark:bg-slate-900 dark:border-slate-800'>
      <CardHeader>
        <CardTitle className='dark:text-white'>Bank Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          {bankAccounts.map((bankAccount) => (
            <BankAccountCard key={bankAccount.id} account={bankAccount} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default BankAccountsTab
