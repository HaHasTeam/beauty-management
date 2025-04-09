'use client'

import { InteractiveAreaChart } from '@/components/ui/chart/InteractiveAreaChart'
import { Skeleton } from '@/components/ui/skeleton'
import { OrderStatic } from '@/network/apis/transaction/type'
import { formatCurrency } from '@/utils/number'
import { Banknote, CreditCard, InfoIcon, Tag, ShoppingCart } from 'lucide-react'

type StaticProps = {
  data: OrderStatic | undefined
}

const Static = ({ data }: StaticProps) => {
  const chartConfig = {
    revenue: {
      label: 'Revenue',
      color: 'chart-1'
    },
    platformDiscount: {
      label: 'Platform Discount',
      color: 'chart-green'
    },
    shopDiscount: {
      label: 'Shop Discount',
      color: 'chart-yellow'
    }
  }

  if (!data?.items) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-[250px] w-full' />
      </div>
    )
  }

  // Check if the data has the expected properties
  console.log('Data structure:', {
    totalSample: data.total,
    itemSample: data.items[0]
  })

  const chartData = data.items.map((item) => ({
    date: item.date,
    revenue: item.totalRevenue,
    platformDiscount: item.totalPlatformVoucherDiscount,
    shopDiscount: item.totalShopVoucherDiscount
  }))

  // Create a React node for the description with cards and icons
  const descriptionNode = (
    <div className='w-full grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2'>
      <div className='w-full flex items-start space-x-4 rounded-lg border border-blue-500/20 p-3 bg-blue-500/5 hover:bg-blue-500/10 transition-colors'>
        <div className='rounded-full bg-blue-500/20 p-2 shrink-0'>
          <ShoppingCart className='h-4 w-4 text-blue-500' />
        </div>
        <div className='min-w-0 flex-1 overflow-hidden'>
          <p className='text-sm font-medium text-muted-foreground truncate'>Total Orders</p>
          <p className='text-lg md:text-xl font-bold truncate text-blue-500'>{data.total.totalQuantity}</p>
        </div>
      </div>

      <div className='w-full flex items-start space-x-4 rounded-lg border border-primary/20 p-3 bg-primary/5 hover:bg-primary/10 transition-colors'>
        <div className='rounded-full bg-primary/20 p-2 shrink-0'>
          <Banknote className='h-4 w-4 text-primary' />
        </div>
        <div className='min-w-0 flex-1 overflow-hidden'>
          <p className='text-sm font-medium text-muted-foreground truncate'>Revenue</p>
          <p className='text-lg md:text-xl font-bold truncate text-primary'>
            {formatCurrency(data.total.totalRevenue, 'vi-VN')}
          </p>
        </div>
      </div>

      <div className='w-full flex items-start space-x-4 rounded-lg border border-green-500/20 p-3 bg-green-500/5 hover:bg-green-500/10 transition-colors'>
        <div className='rounded-full bg-green-500/20 p-2 shrink-0'>
          <CreditCard className='h-4 w-4 text-green-500' />
        </div>
        <div className='min-w-0 flex-1 overflow-hidden'>
          <p className='text-sm font-medium text-muted-foreground truncate'>Platform Discount</p>
          <p className='text-lg md:text-xl font-bold truncate text-green-500'>
            {formatCurrency(data.total.totalPlatformVoucherDiscount, 'vi-VN')}
          </p>
        </div>
      </div>

      <div className='w-full flex items-start space-x-4 rounded-lg border border-yellow-500/20 p-3 bg-yellow-500/5 hover:bg-yellow-500/10 transition-colors'>
        <div className='rounded-full bg-yellow-500/20 p-2 shrink-0'>
          <Tag className='h-4 w-4 text-yellow-500' />
        </div>
        <div className='min-w-0 flex-1 overflow-hidden'>
          <p className='text-sm font-medium text-muted-foreground truncate'>Shop Discount</p>
          <p className='text-lg md:text-xl font-bold truncate text-yellow-500'>
            {formatCurrency(data.total.totalShopVoucherDiscount, 'vi-VN')}
          </p>
        </div>
      </div>
    </div>
  )

  // Create a bottom label for additional chart information
  const bottomLabelNode = (
    <div className='text-sm text-muted-foreground px-1 border-t pt-3 mt-1'>
      <div className='flex items-center gap-0.5 mb-2'>
        <div className='rounded-full p-1'>
          <InfoIcon className='h-3.5 w-3.5' />
        </div>
        <p className='font-medium'>Chart Information</p>
      </div>
      <div className='space-y-2'>
        <p>
          This chart displays daily revenue and discount trends over the selected time period. Values are shown in
          Vietnamese Dong (VND).
        </p>
      </div>
    </div>
  )

  return (
    <InteractiveAreaChart
      data={chartData}
      title=''
      description={descriptionNode}
      config={chartConfig}
      bottomLabel={bottomLabelNode}
    />
  )
}

export default Static
