'use client'

import { InteractiveAreaChart } from '@/components/ui/chart/InteractiveAreaChart'
import { BookingStatic } from '@/network/apis/transaction/type'
import { formatCurrency } from '@/utils/number'
import { Banknote, DollarSign, InfoIcon, ListOrdered, Percent } from 'lucide-react'

type BookingStaticChartProps = {
  data: BookingStatic | undefined
  mode?: 'full' | 'mini'
}

const BookingStaticChart = ({ data, mode = 'full' }: BookingStaticChartProps) => {
  const chartConfig = {
    bookedPrice: {
      label: 'Booked Price',
      color: 'chart-blue'
    },
    refundedPrice: {
      label: 'Refunded Price',
      color: 'chart-red'
    },
    commissionFee: {
      label: 'Commission Fee',
      color: 'chart-gray-4'
    },
    actualRevenue: {
      label: 'Actual Revenue',
      color: 'chart-green'
    }
  }

  if (!data?.items?.length || !data?.total) {
    return (
      <div className='space-y-4 '>
        <p className='text-sm text-muted-foreground w-full text-center p-8'>No booking data</p>
      </div>
    )
  }
  console.log('data.items', data.items)

  const chartData = data.items.map((item) => ({
    date: item.date,
    bookedPrice: item.booked?.totalPrice || 0,
    refundedPrice: item.cancelled?.totalPrice || 0,
    commissionFee: item.booked?.commissionFee || 0,
    actualRevenue: item.booked?.actualRevenue || 0
  }))

  // --- Full Mode Cards (Existing) ---
  const bookedPriceCardFull = (
    <div className='w-full flex items-start space-x-4 rounded-lg border border-[hsl(var(--chart-blue))] p-3 bg-[hsla(var(--chart-blue)/0.05)] hover:bg-[hsla(var(--chart-blue)/0.1)] transition-colors'>
      <div className='rounded-full bg-[hsla(var(--chart-blue)/0.2)] p-2 shrink-0'>
        <Banknote className='h-4 w-4 text-[hsl(var(--chart-blue))] ' />
      </div>
      <div className='min-w-0 flex-1 overflow-hidden'>
        <p className='text-sm font-medium text-muted-foreground truncate'>Booked Price</p>
        <p className='text-lg md:text-xl font-bold truncate text-[hsl(var(--chart-blue))]'>
          {formatCurrency(data.total.booked?.totalPrice || 0, 'vi-VN')}
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
        <p className='text-lg md:text-xl font-bold truncate text-[hsl(var(--chart-gray-4))]'>
          {formatCurrency(data.total.booked?.commissionFee || 0, 'vi-VN')}
        </p>
      </div>
    </div>
  )

  const actualRevenueCardFull = (
    <div className='w-full flex items-start space-x-4 rounded-lg border border-[hsl(var(--chart-green))] p-3 bg-[hsla(var(--chart-green)/0.05)] hover:bg-[hsla(var(--chart-green)/0.1)] transition-colors'>
      <div className='rounded-full bg-[hsla(var(--chart-green)/0.2)] p-2 shrink-0'>
        <DollarSign className='h-4 w-4 text-[hsl(var(--chart-green))] ' />
      </div>
      <div className='min-w-0 flex-1 overflow-hidden'>
        <p className='text-sm font-medium text-muted-foreground truncate'>Actual Revenue</p>
        <p className='text-lg md:text-xl font-bold truncate text-[hsl(var(--chart-green))]'>
          {formatCurrency(data.total.booked?.actualRevenue || 0, 'vi-VN')}
        </p>
      </div>
    </div>
  )

  const bookingCountCardFull = (
    <div className='w-full flex items-start space-x-4 rounded-lg border border-orange-500/20 p-3 bg-orange-500/5 hover:bg-orange-500/10 transition-colors'>
      <div className='rounded-full bg-orange-500/20 p-2 shrink-0'>
        <ListOrdered className='h-4 w-4 text-orange-500' />
      </div>
      <div className='min-w-0 flex-1 overflow-hidden'>
        <p className='text-sm font-medium text-muted-foreground truncate'>Booking Count</p>
        <p className='text-lg md:text-xl font-bold truncate text-orange-500'>{data.total.booked?.count || 0}</p>
      </div>
    </div>
  )

  const fullDescriptionNode = (
    <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 pt-2'>
      {bookedPriceCardFull}
      {commissionFeeCardFull}
      {actualRevenueCardFull}
      {bookingCountCardFull}
    </div>
  )

  // --- Mini Mode Cards (New) ---
  const actualRevenueCardMini = (
    <div className='flex items-center space-x-2 rounded-lg border border-[hsl(var(--chart-green))] p-2 bg-[hsla(var(--chart-green)/0.05)] hover:bg-[hsla(var(--chart-green)/0.1)] transition-colors flex-1 min-w-[150px]'>
      <div className='rounded-full bg-[hsla(var(--chart-green)/0.2)] p-1.5 shrink-0'>
        <DollarSign className='h-3.5 w-3.5 text-[hsl(var(--chart-green))] ' />
      </div>
      <div className='min-w-0 flex-1 overflow-hidden'>
        <p className='text-xs font-medium text-muted-foreground truncate'>Actual Revenue</p>
        <p className='text-sm font-bold truncate text-[hsl(var(--chart-green))] '>
          {formatCurrency(data.total.booked?.actualRevenue || 0, 'vi-VN')}
        </p>
      </div>
    </div>
  )

  const bookingCountCardMini = (
    <div className='flex items-center space-x-2 rounded-lg border border-orange-500/20 p-2 bg-orange-500/5 hover:bg-orange-500/10 transition-colors flex-1 min-w-[150px]'>
      <div className='rounded-full bg-orange-500/20 p-1.5 shrink-0'>
        <ListOrdered className='h-3.5 w-3.5 text-orange-500' />
      </div>
      <div className='min-w-0 flex-1 overflow-hidden'>
        <p className='text-xs font-medium text-muted-foreground truncate'>Booking Count</p>
        <p className='text-sm font-bold truncate text-orange-500'>{data.total.booked?.count || 0}</p>
      </div>
    </div>
  )

  const miniDescriptionNode = (
    <div className='w-full flex flex-row flex-wrap gap-3 pt-2'>
      {actualRevenueCardMini}
      {bookingCountCardMini}
    </div>
  )

  const bottomLabelNode = (
    <div className='text-sm text-muted-foreground px-1 border-t pt-3 mt-1'>
      <div className='flex items-center gap-0.5 mb-2'>
        <div className='rounded-full p-1'>
          <InfoIcon className='h-3.5 w-3.5' />
        </div>
        <p className='font-medium'>Booking Chart Information</p>
      </div>
      <div className='space-y-2'>
        <p>
          This chart displays daily booking price trends over the selected time period. Values are shown in Vietnamese
          Dong (VND).
        </p>
      </div>
    </div>
  )

  return (
    <InteractiveAreaChart
      data={chartData}
      title=''
      description={mode === 'mini' ? miniDescriptionNode : fullDescriptionNode}
      config={chartConfig}
      bottomLabel={mode === 'full' ? bottomLabelNode : undefined}
      mode={mode}
    />
  )
}

export default BookingStaticChart
