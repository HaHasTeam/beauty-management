import { InteractiveAreaChart } from '@/components/ui/chart/InteractiveAreaChart'
import { OrderStatic } from '@/network/apis/transaction/type'
import { formatCurrency } from '@/utils/number'
import { Banknote, CreditCard, DollarSign, InfoIcon, ListOrdered, Percent, ShoppingCart, Tag } from 'lucide-react'
import type { ChartConfig } from '../../chart'

// Renamed props to avoid conflict
type OrderStaticProps = {
  data: OrderStatic | undefined
  mode?: 'full' | 'mini'
  showOnlyVoucher?: 'platform' | 'shop'
  isAdminMini?: boolean
}

const Static = ({ data, mode = 'full', showOnlyVoucher, isAdminMini }: OrderStaticProps) => {
  const fullChartConfig: ChartConfig = {
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

  const filteredChartConfig = (() => {
    if (showOnlyVoucher === 'platform') {
      return { platformDiscount: fullChartConfig.platformDiscount }
    } else if (showOnlyVoucher === 'shop') {
      return { shopDiscount: fullChartConfig.shopDiscount }
    } else {
      return fullChartConfig
    }
  })()

  if (!data?.items?.length || !data?.total) {
    return (
      <div className='space-y-4 '>
        <p className='text-sm text-muted-foreground w-full text-center p-8'>No data</p>
      </div>
    )
  }

  const chartData = data.items.map((item) => ({
    date: item.date,
    revenue: item.totalRevenue ?? 0,
    platformDiscount: item.totalPlatformVoucherDiscount ?? 0,
    shopDiscount: item.totalShopVoucherDiscount ?? 0,
    actualRevenue: item.actualRevenue ?? 0,
    totalCommissionFee: item.totalCommissionFee ?? 0
  }))

  const revenueCardFull = (
    <div className='w-full flex items-start space-x-4 rounded-lg border border-[hsl(var(--chart-1))] p-3 bg-[hsla(var(--chart-1)/0.05)] hover:bg-[hsla(var(--chart-1)/0.1)] transition-colors'>
      <div className='rounded-full bg-[hsla(var(--chart-1)/0.2)] p-2 shrink-0'>
        <Banknote className='h-4 w-4 text-[hsl(var(--chart-1))] ' />
      </div>
      <div className='min-w-0 flex-1 overflow-hidden'>
        <p className='text-sm font-medium text-muted-foreground truncate'>Revenue</p>
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
  const orderCountCardFull = (
    <div className='w-full flex items-start space-x-4 rounded-lg border border-orange-500/20 p-3 bg-orange-500/5 hover:bg-orange-500/10 transition-colors'>
      <div className='rounded-full bg-orange-500/20 p-2 shrink-0'>
        <ListOrdered className='h-4 w-4 text-orange-500' />
      </div>
      <div className='min-w-0 flex-1 overflow-hidden'>
        <p className='text-sm font-medium text-muted-foreground truncate'>Order Count</p>
        <p className='text-lg md:text-xl font-bold truncate text-orange-500'>{data.total.orderCount}</p>
      </div>
    </div>
  )
  const platformDiscountCardFull = (
    <div className='w-full flex items-start space-x-4 rounded-lg border border-[hsl(var(--chart-green))] p-3 bg-[hsla(var(--chart-green)/0.05)] hover:bg-[hsla(var(--chart-green)/0.1)] transition-colors'>
      <div className='rounded-full bg-[hsla(var(--chart-green)/0.2)] p-2 shrink-0'>
        <CreditCard className='h-4 w-4 text-[hsl(var(--chart-green))] ' />
      </div>
      <div className='min-w-0 flex-1 overflow-hidden'>
        <p className='text-sm font-medium text-muted-foreground truncate'>Platform Discount</p>
        <p className='text-lg md:text-xl font-bold truncate text-[hsl(var(--chart-green))] '>
          {formatCurrency(data.total.totalPlatformVoucherDiscount, 'vi-VN')}
        </p>
      </div>
    </div>
  )
  const shopDiscountCardFull = (
    <div className='w-full flex items-start space-x-4 rounded-lg border border-[hsl(var(--chart-yellow))] p-3 bg-[hsla(var(--chart-yellow)/0.05)] hover:bg-[hsla(var(--chart-yellow)/0.1)] transition-colors'>
      <div className='rounded-full bg-[hsla(var(--chart-yellow)/0.2)] p-2 shrink-0'>
        <Tag className='h-4 w-4 text-[hsl(var(--chart-yellow))] ' />
      </div>
      <div className='min-w-0 flex-1 overflow-hidden'>
        <p className='text-sm font-medium text-muted-foreground truncate'>Shop Discount</p>
        <p className='text-lg md:text-xl font-bold truncate text-[hsl(var(--chart-yellow))] '>
          {formatCurrency(data.total.totalShopVoucherDiscount, 'vi-VN')}
        </p>
      </div>
    </div>
  )
  const quantitySoldCardFull = (
    <div className='w-full flex items-start space-x-4 rounded-lg border border-[hsl(var(--chart-violet))] p-3 bg-[hsla(var(--chart-violet)/0.05)] hover:bg-[hsla(var(--chart-violet)/0.1)] transition-colors'>
      <div className='rounded-full bg-[hsla(var(--chart-violet)/0.2)] p-2 shrink-0'>
        <ShoppingCart className='h-4 w-4 text-[hsl(var(--chart-violet))] ' />
      </div>
      <div className='min-w-0 flex-1 overflow-hidden'>
        <p className='text-sm font-medium text-muted-foreground truncate'>Total Quantity Sold</p>
        <p className='text-lg md:text-xl font-bold truncate text-[hsl(var(--chart-violet))] '>
          {data.total.totalQuantity}
        </p>
      </div>
    </div>
  )
  const revenueCardMini = (
    <div className='flex items-center space-x-2 rounded-lg border border-[hsl(var(--chart-1))] p-2 bg-[hsla(var(--chart-1)/0.05)] hover:bg-[hsla(var(--chart-1)/0.1)] transition-colors flex-1 min-w-[150px]'>
      <div className='rounded-full bg-[hsla(var(--chart-1)/0.2)] p-1.5 shrink-0'>
        <DollarSign className='h-3.5 w-3.5 text-[hsl(var(--chart-1))] ' />
      </div>
      <div className='min-w-0 flex-1 overflow-hidden'>
        <p className='text-xs font-medium text-muted-foreground truncate'>Revenue</p>
        <p className='text-sm font-bold truncate text-[hsl(var(--chart-1))] '>
          {formatCurrency(data.total.totalRevenue, 'vi-VN')}
        </p>
      </div>
    </div>
  )
  const commissionFeeCardMini = (
    <div className='flex items-center space-x-2 rounded-lg border border-[hsl(var(--chart-gray-4))] p-2 bg-[hsla(var(--chart-gray-4)/0.05)] hover:bg-[hsla(var(--chart-gray-4)/0.1)] transition-colors flex-1 min-w-[150px]'>
      <div className='rounded-full bg-[hsla(var(--chart-gray-4)/0.2)] p-1.5 shrink-0'>
        <Banknote className='h-3.5 w-3.5 text-[hsl(var(--chart-gray-4))] ' />
      </div>
      <div className='min-w-0 flex-1 overflow-hidden'>
        <p className='text-xs font-medium text-muted-foreground truncate'>Commission Fee</p>
        <p className='text-sm font-bold truncate text-[hsl(var(--chart-gray-4))] '>
          {formatCurrency(data.total.totalCommissionFee, 'vi-VN')}
        </p>
      </div>
    </div>
  )
  const actualRevenueCardMini = (
    <div className='flex items-center space-x-2 rounded-lg border border-[hsl(var(--chart-blue))] p-2 bg-[hsla(var(--chart-blue)/0.05)] hover:bg-[hsla(var(--chart-blue)/0.1)] transition-colors flex-1 min-w-[150px]'>
      <div className='rounded-full bg-[hsla(var(--chart-blue)/0.2)] p-1.5 shrink-0'>
        <DollarSign className='h-3.5 w-3.5 text-[hsl(var(--chart-blue))] ' />
      </div>
      <div className='min-w-0 flex-1 overflow-hidden'>
        <p className='text-xs font-medium text-muted-foreground truncate'>Actual Revenue</p>
        <p className='text-sm font-bold truncate text-[hsl(var(--chart-blue))] '>
          {formatCurrency(data.total.actualRevenue, 'vi-VN')}
        </p>
      </div>
    </div>
  )
  const orderCountCardMini = (
    <div className='flex items-center space-x-2 rounded-lg border border-orange-500/20 p-2 bg-orange-500/5 hover:bg-orange-500/10 transition-colors flex-1 min-w-[150px]'>
      <div className='rounded-full bg-orange-500/20 p-1.5 shrink-0'>
        <ListOrdered className='h-3.5 w-3.5 text-orange-500' />
      </div>
      <div className='min-w-0 flex-1 overflow-hidden'>
        <p className='text-xs font-medium text-muted-foreground truncate'>Order Count</p>
        <p className='text-sm font-bold truncate text-orange-500'>{data.total.orderCount}</p>
      </div>
    </div>
  )
  const platformDiscountCardMini = (
    <div className='flex items-center space-x-2 rounded-lg border border-[hsl(var(--chart-green))] p-2 bg-[hsla(var(--chart-green)/0.05)] hover:bg-[hsla(var(--chart-green)/0.1)] transition-colors flex-1 min-w-[150px]'>
      <div className='rounded-full bg-[hsla(var(--chart-green)/0.2)] p-1.5 shrink-0'>
        <CreditCard className='h-3.5 w-3.5 text-[hsl(var(--chart-green))] ' />
      </div>
      <div className='min-w-0 flex-1 overflow-hidden'>
        <p className='text-xs font-medium text-muted-foreground truncate'>Platform Discount</p>
        <p className='text-sm font-bold truncate text-[hsl(var(--chart-green))] '>
          {formatCurrency(data.total.totalPlatformVoucherDiscount, 'vi-VN')}
        </p>
      </div>
    </div>
  )
  const shopDiscountCardMini = (
    <div className='flex items-center space-x-2 rounded-lg border border-[hsl(var(--chart-yellow))] p-2 bg-[hsla(var(--chart-yellow)/0.05)] hover:bg-[hsla(var(--chart-yellow)/0.1)] transition-colors flex-1 min-w-[150px]'>
      <div className='rounded-full bg-[hsla(var(--chart-yellow)/0.2)] p-1.5 shrink-0'>
        <Tag className='h-3.5 w-3.5 text-[hsl(var(--chart-yellow))] ' />
      </div>
      <div className='min-w-0 flex-1 overflow-hidden'>
        <p className='text-xs font-medium text-muted-foreground truncate'>Shop Discount</p>
        <p className='text-sm font-bold truncate text-[hsl(var(--chart-yellow))] '>
          {formatCurrency(data.total.totalShopVoucherDiscount, 'vi-VN')}
        </p>
      </div>
    </div>
  )

  const fullDescriptionNode = (
    <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2'>
      {showOnlyVoucher === 'platform' ? (
        platformDiscountCardFull
      ) : showOnlyVoucher === 'shop' ? (
        shopDiscountCardFull
      ) : (
        <>
          {revenueCardFull}
          {actualRevenueCardFull}
          {commissionFeeCardFull}
          {orderCountCardFull}
          {platformDiscountCardFull}
          {shopDiscountCardFull}
          {quantitySoldCardFull}
        </>
      )}
    </div>
  )

  const miniDescriptionNode = (
    <div className='w-full flex flex-row flex-wrap gap-3 pt-2'>
      {showOnlyVoucher === 'platform' ? (
        platformDiscountCardMini
      ) : showOnlyVoucher === 'shop' ? (
        shopDiscountCardMini
      ) : isAdminMini ? (
        <>
          {revenueCardMini}
          {platformDiscountCardMini}
          {commissionFeeCardMini}
        </>
      ) : (
        <>
          {actualRevenueCardMini}
          {orderCountCardMini}
        </>
      )}
    </div>
  )

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
      description={mode === 'mini' ? miniDescriptionNode : fullDescriptionNode}
      // @ts-expect-error - Ignore persistent type mismatch between general ChartConfig and InteractiveAreaChart's expected type
      config={filteredChartConfig as unknown as ChartConfig}
      bottomLabel={mode === 'full' && !showOnlyVoucher ? bottomLabelNode : undefined}
      mode={mode}
    />
  )
}

export default Static
