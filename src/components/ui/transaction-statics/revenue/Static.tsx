import { TGetBrandRevenueStatisticsResponse } from '@/network/apis/transaction/type'
import { CheckCircle, AlertTriangle, RotateCcw, Ban, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/utils/number'
import { useMemo } from 'react'

type StaticProps = {
  data: TGetBrandRevenueStatisticsResponse | undefined
}

const Static = ({ data }: StaticProps) => {
  const hasData = useMemo(() => {
    return (
      !!data &&
      !!data.completedOrders &&
      !!data.cancelledOrders &&
      !!data.refundedOrders &&
      !!data.inProgressReturnedOrders &&
      !!data.unpaidForBrandOrders
    )
  }, [data])

  if (!hasData) {
    return (
      <div className='w-full p-6 flex justify-center'>
        <p className='text-muted-foreground'>No data available</p>
      </div>
    )
  }

  return (
    <div className='w-full flex flex-col gap-4'>
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2'>
        <div className='w-full flex items-start space-x-4 rounded-lg border border-green-500/20 p-3 bg-green-500/5 hover:bg-green-500/10 transition-colors'>
          <div className='rounded-full bg-green-500/20 p-2 shrink-0'>
            <CheckCircle className='h-4 w-4 text-green-500' />
          </div>
          <div className='min-w-0 flex-1 overflow-hidden'>
            <p className='text-sm font-medium text-muted-foreground truncate'>Completed Orders</p>
            <div className='flex items-baseline justify-between'>
              <span className='text-lg md:text-xl font-bold truncate text-green-500'>
                {data?.completedOrders?.count || 0}
              </span>
              <span className='text-xs text-muted-foreground ml-2'>
                {formatCurrency(data?.completedOrders?.sumTotalPrice || 0, 'vi-VN')}
              </span>
            </div>
          </div>
        </div>

        <div className='w-full flex items-start space-x-4 rounded-lg border border-yellow-500/20 p-3 bg-yellow-500/5 hover:bg-yellow-500/10 transition-colors'>
          <div className='rounded-full bg-yellow-500/20 p-2 shrink-0'>
            <AlertCircle className='h-4 w-4 text-yellow-500' />
          </div>
          <div className='min-w-0 flex-1 overflow-hidden'>
            <p className='text-sm font-medium text-muted-foreground truncate'>Unpaid Orders</p>
            <div className='flex items-baseline justify-between'>
              <span className='text-lg md:text-xl font-bold truncate text-yellow-500'>
                {data?.unpaidForBrandOrders?.count || 0}
              </span>
              <span className='text-xs text-muted-foreground ml-2'>
                {formatCurrency(data?.unpaidForBrandOrders?.sumTotalPrice || 0, 'vi-VN')}
              </span>
            </div>
          </div>
        </div>

        <div className='w-full flex items-start space-x-4 rounded-lg border border-red-500/20 p-3 bg-red-500/5 hover:bg-red-500/10 transition-colors'>
          <div className='rounded-full bg-red-500/20 p-2 shrink-0'>
            <Ban className='h-4 w-4 text-red-500' />
          </div>
          <div className='min-w-0 flex-1 overflow-hidden'>
            <p className='text-sm font-medium text-muted-foreground truncate'>Cancelled Orders</p>
            <div className='flex items-baseline justify-between'>
              <span className='text-lg md:text-xl font-bold truncate text-red-500'>
                {data?.cancelledOrders?.count || 0}
              </span>
              <span className='text-xs text-muted-foreground ml-2'>
                {formatCurrency(data?.cancelledOrders?.sumTotalPrice || 0, 'vi-VN')}
              </span>
            </div>
          </div>
        </div>

        <div className='w-full flex items-start space-x-4 rounded-lg border border-blue-500/20 p-3 bg-blue-500/5 hover:bg-blue-500/10 transition-colors'>
          <div className='rounded-full bg-blue-500/20 p-2 shrink-0'>
            <RotateCcw className='h-4 w-4 text-blue-500' />
          </div>
          <div className='min-w-0 flex-1 overflow-hidden'>
            <p className='text-sm font-medium text-muted-foreground truncate'>Refunded Orders</p>
            <div className='flex items-baseline justify-between'>
              <span className='text-lg md:text-xl font-bold truncate text-blue-500'>
                {data?.refundedOrders?.count || 0}
              </span>
              <span className='text-xs text-muted-foreground ml-2'>
                {formatCurrency(data?.refundedOrders?.sumTotalPrice || 0, 'vi-VN')}
              </span>
            </div>
          </div>
        </div>

        <div className='w-full flex items-start space-x-4 rounded-lg border border-orange-500/20 p-3 bg-orange-500/5 hover:bg-orange-500/10 transition-colors'>
          <div className='rounded-full bg-orange-500/20 p-2 shrink-0'>
            <AlertTriangle className='h-4 w-4 text-orange-500' />
          </div>
          <div className='min-w-0 flex-1 overflow-hidden'>
            <p className='text-sm font-medium text-muted-foreground truncate'>In Progress Returns</p>
            <div className='flex items-baseline justify-between'>
              <span className='text-lg md:text-xl font-bold truncate text-orange-500'>
                {data?.inProgressReturnedOrders?.count || 0}
              </span>
              <span className='text-xs text-muted-foreground ml-2'>
                {formatCurrency(data?.inProgressReturnedOrders?.sumTotalPrice || 0, 'vi-VN')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Static
