'use client'

import { InteractiveAreaChart } from '@/components/ui/chart/InteractiveAreaChart'
import { DailySystemStatistics } from '@/network/apis/transaction/type'
import { formatCurrency } from '@/utils/number'
import { Banknote, Info, Percent, ShoppingBag, CreditCard, Wallet } from 'lucide-react'

type StaticProps = {
  data: DailySystemStatistics | undefined
}

type ChartConfig = {
  [key: string]: {
    label: string
    color: string
  }
}

const Static = ({ data }: StaticProps) => {
  const fullChartConfig: ChartConfig = {
    totalRevenue: {
      label: 'Gross Sales',
      color: 'chart-green' // Positive color for total revenue
    },
    totalPlatformVoucherDiscount: {
      label: 'Platform Promotions',
      color: 'chart-orange' // Warning color for discounts
    },
    actualRevenue: {
      label: 'Net Sales',
      color: 'chart-blue' // Trustworthy color for actual revenue
    },
    totalCommissionFee: {
      label: 'Platform Commission',
      color: 'chart-red' // Alert color for fees
    },
    totalPlatformRevenue: {
      label: 'Platform Revenue',
      color: 'chart-purple' // Success color for platform revenue
    }
  }

  if (!data?.items?.length || !data?.total) {
    return (
      <div className='space-y-4'>
        <p className='text-sm text-muted-foreground w-full text-center p-8'>No data</p>
      </div>
    )
  }

  const statsCards = (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4'>
      <div className='p-4 rounded-lg border border-[hsl(var(--chart-green))] bg-[hsla(var(--chart-green)/0.1)]'>
        <div className='flex items-center gap-2'>
          <ShoppingBag className='h-4 w-4 text-[hsl(var(--chart-green))]' />
          <span className='text-sm text-[hsl(var(--chart-green))]'>Gross Sales</span>
        </div>
        <div className='mt-2 text-2xl font-semibold text-[hsl(var(--chart-green))]'>
          {formatCurrency(data.total.totalRevenue)}
        </div>
      </div>

      <div className='p-4 rounded-lg border border-[hsl(var(--chart-blue))] bg-[hsla(var(--chart-blue)/0.1)]'>
        <div className='flex items-center gap-2'>
          <Wallet className='h-4 w-4 text-[hsl(var(--chart-blue))]' />
          <span className='text-sm text-[hsl(var(--chart-blue))]'>Net Sales</span>
        </div>
        <div className='mt-2 text-2xl font-semibold text-[hsl(var(--chart-blue))]'>
          {formatCurrency(data.total.actualRevenue)}
        </div>
      </div>

      <div className='p-4 rounded-lg border border-[hsl(var(--chart-red))] bg-[hsla(var(--chart-red)/0.1)]'>
        <div className='flex items-center gap-2'>
          <CreditCard className='h-4 w-4 text-[hsl(var(--chart-red))]' />
          <span className='text-sm text-[hsl(var(--chart-red))]'>Platform Commission</span>
        </div>
        <div className='mt-2 text-2xl font-semibold text-[hsl(var(--chart-red))]'>
          {formatCurrency(data.total.totalCommissionFee)}
        </div>
      </div>

      <div className='p-4 rounded-lg border border-[hsl(var(--chart-orange))] bg-[hsla(var(--chart-orange)/0.1)]'>
        <div className='flex items-center gap-2'>
          <Percent className='h-4 w-4 text-[hsl(var(--chart-orange))]' />
          <span className='text-sm text-[hsl(var(--chart-orange))]'>Platform Promotions</span>
        </div>
        <div className='mt-2 text-2xl font-semibold text-[hsl(var(--chart-orange))]'>
          {formatCurrency(data.total.totalPlatformVoucherDiscount)}
        </div>
      </div>

      <div className='p-4 rounded-lg border border-[hsl(var(--chart-purple))] bg-[hsla(var(--chart-purple)/0.1)]'>
        <div className='flex items-center gap-2'>
          <Banknote className='h-4 w-4 text-[hsl(var(--chart-purple))]' />
          <span className='text-sm text-[hsl(var(--chart-purple))]'>Platform Revenue</span>
        </div>
        <div className='mt-2 text-2xl font-semibold text-[hsl(var(--chart-purple))]'>
          {formatCurrency(data.total.totalPlatformRevenue)}
        </div>
      </div>
    </div>
  )

  const chartData = data.items.map((item) => ({
    date: item.date,
    totalRevenue: item.totalRevenue,
    totalPlatformVoucherDiscount: item.totalPlatformVoucherDiscount,
    actualRevenue: item.actualRevenue,
    totalCommissionFee: item.totalCommissionFee,
    totalPlatformRevenue: item.totalPlatformRevenue
  }))

  return (
    <InteractiveAreaChart
      data={chartData}
      title=''
      description={statsCards}
      config={fullChartConfig}
      bottomLabel={
        <p className='text-sm text-muted-foreground flex items-center gap-2'>
          <Info />
          This chart shows the daily sales metrics, including gross sales, net sales, platform commission, promotions,
          and platform revenue.
        </p>
      }
    />
  )
}

export default Static
