import { Banknote, Wallet } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import TransactionTableUI from './transaction-table-ui'
import WithdrawalTableUI from './withdrawal-requests-table-ui'

export default function TransactionManagementPage() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  // Define the tab query state with nuqs
  const [activeTab, setActiveTab] = useQueryState('tab', { defaultValue: 'transactions' })

  // Handle tab change - clear other URL params
  const handleTabChange = (value: string) => {
    setActiveTab(value)

    // Clear all other query params by navigating to the current path with only the tab param
    navigate({ pathname: location.pathname, search: `?tab=${value}` })
  }

  return (
    <div className=''>
      <Tabs value={activeTab} onValueChange={handleTabChange} className='w-full'>
        <TabsList className='w-fit grid-cols-2 mb-6'>
          <TabsTrigger value='transactions' className='flex items-center gap-2'>
            <Wallet className='h-4 w-4' />
            <span>{t('transaction.tabs.all')}</span>
          </TabsTrigger>
          <TabsTrigger value='withdrawals' className='flex items-center gap-2'>
            <Banknote className='h-4 w-4' />
            <span>{t('wallet.withdrawalRequests.title', 'Withdrawal Requests')}</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value='transactions'>
          <h2 className='text-xl font-semibold mb-4'>{t('transaction.list')}</h2>
          {/* Transaction table will be implemented here */}
          <TransactionTableUI />
        </TabsContent>
        <TabsContent value='withdrawals'>
          <h2 className='text-xl font-semibold mb-4'>{t('wallet.withdrawalRequests.title', 'Withdrawal Requests')}</h2>
          {/* Withdrawal request table will be implemented here */}
          <WithdrawalTableUI />
        </TabsContent>
      </Tabs>
    </div>
  )
}
