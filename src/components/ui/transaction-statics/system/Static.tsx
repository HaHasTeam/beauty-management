import { InteractiveAreaChart } from '@/components/ui/chart/InteractiveAreaChart'
import { DailySystemStatistics } from '@/network/apis/transaction/type'
import { formatCurrency } from '@/utils/number'
import { Banknote, DollarSign, Info, Percent } from 'lucide-react'

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
    revenue: {
      label: 'Revenue',
      color: 'chart-1'
    },
    platformDiscount: {
      label: 'Platform Discount',
      color: 'chart-green'
    },
    actualRevenue: {
      label: 'Actual Revenue',
      color: 'chart-blue'
    },
    totalCommissionFee: {
      label: 'Commission Fee',
      color: 'chart-gray-4'
    }
  }

  if (!data?.items?.length || !data?.total) {
    return (
      <div className='space-y-4'>
        <p className='text-sm text-muted-foreground w-full text-center p-8'>No data</p>
      </div>
    )
  }

  const chartData = data.items.map((item) => ({
    date: item.date,
    revenue: item.totalRevenue ?? 0,
    platformDiscount: item.totalPlatformVoucherDiscount ?? 0,
    actualRevenue: item.actualRevenue ?? 0,
    totalCommissionFee: item.totalCommissionFee ?? 0
  }))

  const revenueCardFull = (
    <div className='w-full flex items-start space-x-4 rounded-lg border border-[hsl(var(--chart-1))] p-3 bg-[hsla(var(--chart-1)/0.05)] hover:bg-[hsla(var(--chart-1)/0.1)] transition-colors'>
      <div className='rounded-full bg-[hsla(var(--chart-1)/0.2)] p-2 shrink-0'>
        <Banknote className='h-4 w-4 text-[hsl(var(--chart-1))] ' />
      </div>
      <div className='min-w-0 flex-1 overflow-hidden'>
        <p className='text-sm font-medium text-muted-foreground truncate'>Total Revenue</p>
        <p className='text-lg md:text-xl font-bold truncate text-[hsl(var(--chart-1))] '>
          {formatCurrency(data.total.totalRevenue, 'vi-VN')}
        </p>
      </div>
    </div>
  )

  const actualRevenueCardFull = (
    <div className='w-full flex items-start space-x-4 rounded-lg border border-[hsl(var(--chart-blue))] p-3 bg-[hsla(var(--chart-blue)/0.05)] hover:bg-[hsla(var(--chart-blue)/0.1)] transition-colors'>
      <div className='rounded-full bg-[hsla(var(--chart-blue)/0.2)] p-2 shrink-0'>
        <DollarSign className='h-4 w-4 text-[hsl(var(--chart-blue))] ' />
      </div>
      <div className='min-w-0 flex-1 overflow-hidden'>
        <p className='text-sm font-medium text-muted-foreground truncate'>Actual Revenue</p>
        <p className='text-lg md:text-xl font-bold truncate text-[hsl(var(--chart-blue))] '>
          {formatCurrency(data.total.actualRevenue, 'vi-VN')}
        </p>
      </div>
    </div>
  )

  const commissionFeeCardFull = (
    <div className='w-full flex items-start space-x-4 rounded-lg border border-[hsl(var(--chart-gray-4))] p-3 bg-[hsla(var(--chart-gray-4)/0.05)] hover:bg-[hsla(var(--chart-gray-4)/0.1)] transition-colors'>
      <div className='rounded-full bg-[hsla(var(--chart-gray-4)/0.2)] p-2 shrink-0'>
        <Percent className='h-4 w-4 text-[hsl(var(--chart-gray-4))] ' />
      </div>
      <div className='min-w-0 flex-1 overflow-hidden'>
        <p className='text-sm font-medium text-muted-foreground truncate'>Commission Fee</p>
        <p className='text-lg md:text-xl font-bold truncate text-[hsl(var(--chart-gray-4))] '>
          {formatCurrency(data.total.totalCommissionFee, 'vi-VN')}
        </p>
      </div>
    </div>
  )

  const platformDiscountCardFull = (
    <div className='w-full flex items-start space-x-4 rounded-lg border border-[hsl(var(--chart-green))] p-3 bg-[hsla(var(--chart-green)/0.05)] hover:bg-[hsla(var(--chart-green)/0.1)] transition-colors'>
      <div className='rounded-full bg-[hsla(var(--chart-green)/0.2)] p-2 shrink-0'>
        <Percent className='h-4 w-4 text-[hsl(var(--chart-green))] ' />
      </div>
      <div className='min-w-0 flex-1 overflow-hidden'>
        <p className='text-sm font-medium text-muted-foreground truncate'>Platform Discount</p>
        <p className='text-lg md:text-xl font-bold truncate text-[hsl(var(--chart-green))] '>
          {formatCurrency(data.total.totalPlatformVoucherDiscount, 'vi-VN')}
        </p>
      </div>
    </div>
  )

  const statsCards = (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {revenueCardFull}
      {actualRevenueCardFull}
      {commissionFeeCardFull}
      {platformDiscountCardFull}
    </div>
  )

  return (
    <InteractiveAreaChart
      data={chartData}
      title=''
      description={statsCards}
      config={fullChartConfig}
      bottomLabel={
        <p className='text-sm text-muted-foreground flex items-center gap-2'>
          <Info />
          This chart shows the daily revenue, actual revenue, commission fees, and platform discounts over time.
        </p>
      }
    />
  )
}

export default Static
