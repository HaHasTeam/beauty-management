import { useQuery } from '@tanstack/react-query'
import { Clock } from 'lucide-react'
import * as React from 'react'

import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TimeSlotPicker } from '@/components/working-time/TimeSlotPicker'
import { getWorkingSlotsOfConsultantApi } from '@/network/apis/slots'

interface WorkingTimeTabProps {
  accountId: string
}

// Hack type definition - to be replaced with proper type
type TimeSlot = {
  date: Date
  slotIndex: number
  id?: string
}

const WorkingTimeTab: React.FC<WorkingTimeTabProps> = ({ accountId }) => {
  // Query to get consultant working slots
  const { data: workingSlotsData, isLoading: isLoadingSlots } = useQuery({
    queryKey: [getWorkingSlotsOfConsultantApi.queryKey, accountId],
    queryFn: getWorkingSlotsOfConsultantApi.fn,
    enabled: !!accountId
  })

  // Transform API data to the format expected by TimeSlotPicker
  const transformedSlots = React.useMemo(() => {
    if (!workingSlotsData?.data || workingSlotsData.data.length === 0) {
      return [] as TimeSlot[]
    }

    // Hard-coded transformation - replace with actual data mapping
    return [
      { date: new Date(2023, 0, 2), slotIndex: 9 }, // Monday, 9:00
      { date: new Date(2023, 0, 2), slotIndex: 10 }, // Monday, 10:00
      { date: new Date(2023, 0, 4), slotIndex: 14 }, // Wednesday, 14:00
      { date: new Date(2023, 0, 5), slotIndex: 16 } // Thursday, 16:00
    ] as TimeSlot[]
  }, [workingSlotsData])

  if (isLoadingSlots) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Clock className='h-5 w-5' />
            Working Hours
          </CardTitle>
        </CardHeader>
        <CardContent className='relative min-h-[300px]'>
          <LoadingContentLayer />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Clock className='h-5 w-5' />
          Working Hours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-sm text-muted-foreground mb-4'>
          This is a view-only display of the consultant's working hours.
        </div>

        <TimeSlotPicker
          selectedSlots={transformedSlots}
          disabledSlots={[]}
          onSelectSlot={() => {}} // No-op since this is read-only
          readOnly={true}
        />
      </CardContent>
    </Card>
  )
}

export default WorkingTimeTab
