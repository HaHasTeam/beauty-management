import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BookingStatic from '@/components/ui/transaction-statics/booking'
import BrandRecommendStatic from '@/components/ui/transaction-statics/brand-recommend'

import BookingTable from './booking-table-ui'

export default function BookingManagementPage() {
  const [tab, setTab] = useState<'bookings-statistics' | 'brand-recommendation-statistics'>('bookings-statistics')
  const { t } = useTranslation()
  return (
    <div className='flex flex-col gap-4'>
      <Tabs
        className='w-full'
        value={tab}
        onValueChange={(value) => setTab(value as 'bookings-statistics' | 'brand-recommendation-statistics')}
      >
        <TabsList className='w-fit grid-cols-2 mb-6'>
          <TabsTrigger value='bookings-statistics' className='flex items-center gap-2'>
            <span>Bookings Statistics</span>
          </TabsTrigger>
          <TabsTrigger value='brand-recommendation-statistics' className='flex items-center gap-2'>
            <span>Brand Recommendation Statistics</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value='bookings-statistics'>
          <BookingStatic />
        </TabsContent>
        <TabsContent value='brand-recommendation-statistics'>
          <BrandRecommendStatic />
        </TabsContent>
      </Tabs>
      <h2 className='text-2xl font-semibold'>{t('booking.management', 'Bookings Management')}</h2>
      <BookingTable />
    </div>
  )
}
