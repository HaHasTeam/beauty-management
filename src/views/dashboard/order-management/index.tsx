import { Package, RefreshCw } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OrderStatic } from '@/components/ui/transaction-statics'

import OrderRequestTable from './order-requests-table-ui'
import OrderTable from './order-table-ui'

export default function OrderManagementPage() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  // Define the tab query state with nuqs
  const [activeTab, setActiveTab] = useQueryState('tab', { defaultValue: 'orders' })

  // Handle tab change - clear other URL params
  const handleTabChange = (value: string) => {
    setActiveTab(value)

    // Clear all other query params by navigating to the current path with only the tab param
    navigate({ pathname: location.pathname, search: `?tab=${value}` })
  }

  return (
    <div className='flex flex-col gap-4'>
      <OrderStatic />
      <Tabs value={activeTab} onValueChange={handleTabChange} className='w-full'>
        <TabsList className='w-fit grid-cols-2 mb-6'>
          <TabsTrigger value='orders' className='flex items-center gap-2'>
            <Package className='h-4 w-4' />
            <span>{t('order.tabs.orders', 'Orders')}</span>
          </TabsTrigger>
          <TabsTrigger value='requests' className='flex items-center gap-2'>
            <RefreshCw className='h-4 w-4' />
            <span>{t('order.tabs.requests', 'Requests')}</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value='orders'>
          <h2 className='text-xl font-semibold mb-4'>{t('order.management', 'Orders Management')}</h2>
          <OrderTable />
        </TabsContent>
        <TabsContent value='requests'>
          <h2 className='text-xl font-semibold mb-4'>{t('order.management.requests', 'Order Requests')}</h2>
          <OrderRequestTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
