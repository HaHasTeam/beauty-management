import { useParams } from 'react-router-dom'

import { OrderStatisticsWidget } from '@/components/ui/transaction-statics/order/OrderStatisticsWidget'
import { OrderEnum } from '@/types/enum'

const GroupProductSummary = () => {
  const { id } = useParams()
  if (!id) return null
  return (
    <div>
      <OrderStatisticsWidget
        eventId={id as string}
        orderType={OrderEnum.GROUP_PRODUCT}
        header={<h1 className='text-2xl font-bold'>Group Product Statistics</h1>}
      />
    </div>
  )
}

export default GroupProductSummary
