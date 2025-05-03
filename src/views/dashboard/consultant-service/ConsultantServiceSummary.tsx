import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import { BookingStatisticsWidget } from '@/components/ui/transaction-statics/booking/BookingStatisticsWidget'
import { getConsultantServiceByIdApi } from '@/network/apis/consultant-service'

const ConsultantServiceSummary = () => {
  const { id: consultantServiceId } = useParams()
  const { data: detailConsultantServiceById } = useQuery({
    queryKey: [
      getConsultantServiceByIdApi.queryKey,
      {
        consultantServiceId: consultantServiceId ?? ''
      }
    ],
    queryFn: getConsultantServiceByIdApi.fn,
    enabled: !!consultantServiceId
  })

  return (
    <BookingStatisticsWidget
      consultantServiceId={consultantServiceId}
      consultantAccountId={detailConsultantServiceById?.data?.account.id}
    />
  )
}

export default ConsultantServiceSummary
