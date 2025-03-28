import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { AlarmClock, Clock, SaveIcon } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import Button from '@/components/button'
import { Form } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getAllWorkingSlotsApi, updateActiveSlotsApi } from '@/network/apis/slots'
import { WeekDay } from '@/types/enum'
import { TSlot } from '@/types/slot'

import { Card, CardContent } from '../ui/card'
import { TimeSlotPicker } from './TimeSlotPicker'

/**
 * WorkingTimeForm Component
 *
 * A form for managing beautician working time slots.
 *
 * Features:
 * - Uses React Query for data fetching and mutation
 * - Loads existing slots from API
 * - Allows selection of time slots using TimeSlotPicker
 * - Provides bulk creation of slots
 * - Shows a summary view of selected slots
 * - Error handling and toast notifications
 */

const formSchema = z.object({
  slots: z
    .array(
      z.object({
        date: z.date(),
        slotIndex: z.number(),
        isAvailable: z.boolean().default(true)
      })
    )
    .optional()
})

type FormValues = z.infer<typeof formSchema>

// Map from day name to WeekDay enum
// Only needed if we implement slot creation, keeping it commented for now
/*
const dayNameToWeekDay: Record<string, WeekDay> = {
  Sunday: WeekDay.SUNDAY,
  Monday: WeekDay.MONDAY,
  Tuesday: WeekDay.TUESDAY,
  Wednesday: WeekDay.WEDNESDAY,
  Thursday: WeekDay.THURSDAY,
  Friday: WeekDay.FRIDAY,
  Saturday: WeekDay.SATURDAY
}
*/

export function WorkingTimeForm() {
  const [selectedSlots, setSelectedSlots] = useState<{ date: Date; slotIndex: number; id?: string }[]>([])
  const [activeTab, setActiveTab] = useState<string>('schedule')
  const id = useId()
  const queryClient = useQueryClient()

  // Custom hooks for toast and error handling
  const { successToast, errorToast, warningToast } = useToast()
  const handleServerError = useHandleServerError()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slots: []
    }
  })

  // Map from WeekDay enum to day name - inverse of dayNameToWeekDay
  const weekDayToDayName: Record<number, string> = {
    [WeekDay.SUNDAY]: 'Sunday',
    [WeekDay.MONDAY]: 'Monday',
    [WeekDay.TUESDAY]: 'Tuesday',
    [WeekDay.WEDNESDAY]: 'Wednesday',
    [WeekDay.THURSDAY]: 'Thursday',
    [WeekDay.FRIDAY]: 'Friday',
    [WeekDay.SATURDAY]: 'Saturday'
  }

  // Function to convert hour string ("HH:MM") to slot index
  const getSlotIndexFromTime = (time: string): number => {
    const hour = parseInt(time.split(':')[0], 10)
    return hour
  }

  // Function to get a date object for a specific day name
  // This ensures consistency with the TimeSlotPicker date creation
  const getDateForDayName = (dayName: string): Date | null => {
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const index = dayOrder.indexOf(dayName)
    if (index === -1) return null

    // Use the same date creation approach as TimeSlotPicker
    // The +2 is because we start from day 0 as December 31, day 1 as January 1, etc.
    return new Date(2023, 0, index + 2)
  }

  // Convert API slot data format to our component's slot format
  const convertApiSlotsToComponentFormat = (apiSlots: TSlot[]): { date: Date; slotIndex: number; id: string }[] => {
    return apiSlots
      .map((slot) => {
        // Get the day name from the weekDay enum value
        const dayName = weekDayToDayName[slot.weekDay]
        if (!dayName) {
          // Skip invalid weekDay values
          return null
        }

        // Create a date object for the corresponding day
        const date = getDateForDayName(dayName)
        if (!date) {
          // Skip if we couldn't create a valid date
          return null
        }

        // Convert the time string to slot index
        const slotIndex = getSlotIndexFromTime(slot.startTime)

        return { date, slotIndex, id: slot.id }
      })
      .filter(Boolean) as { date: Date; slotIndex: number; id: string }[]
  }

  // Use React Query to fetch existing slots
  const { data: slotsData, isLoading } = useQuery({
    queryKey: [getAllWorkingSlotsApi.queryKey],
    queryFn: () => getAllWorkingSlotsApi.fn({ queryKey: [getAllWorkingSlotsApi.queryKey] })
  })

  // Process the data when it becomes available - moved to useEffect to prevent infinite renders
  useEffect(() => {
    if (slotsData?.data) {
      const convertedSlots = convertApiSlotsToComponentFormat(slotsData.data)
      // Mark slots as selected if they are active
      const activeSlots = convertedSlots.filter((slot) => {
        const matchingSlot = slotsData.data.find((s) => s.id === slot.id)
        return matchingSlot?.isActive
      })
      setSelectedSlots(activeSlots)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotsData?.data])

  // Use React Query mutation for updating active slots
  const { mutateAsync: updateActiveSlots, isPending: isUpdating } = useMutation({
    mutationKey: [updateActiveSlotsApi.mutationKey],
    mutationFn: (data: { slotIds: string[] }) => updateActiveSlotsApi.fn(data),
    onSuccess: () => {
      successToast({
        message: 'Working schedule updated successfully',
        description: 'Your active time slots have been updated'
      })
      // Invalidate and refetch the slots query
      queryClient.invalidateQueries({ queryKey: [getAllWorkingSlotsApi.queryKey] })

      // Reset initialization flag to allow re-initialization with new data
    },
    onError: (error) => {
      handleServerError({ error, form })
      errorToast({
        message: 'Failed to update working schedule',
        description: 'There was an error updating your active time slots'
      })
    }
  })

  // Create a manual submit handler separate from form.handleSubmit
  const handleManualSubmit = async () => {
    if (selectedSlots.length === 0) {
      warningToast({
        message: 'Please select at least one time slot',
        description: 'You need to select time slots to save your schedule'
      })
      return
    }

    try {
      // Extract slot IDs from selected slots
      const slotIds = selectedSlots
        .filter((slot) => slot.id) // Only include slots that have IDs
        .map((slot) => slot.id!) // Extract the ID (we know it exists due to the filter)

      // If we have slot IDs, update the active slots
      if (slotIds.length > 0) {
        await updateActiveSlots({ slotIds })
        queryClient.invalidateQueries({ queryKey: [getAllWorkingSlotsApi.queryKey] })
      } else {
        // Currently we only support updating existing slots, not creating new ones
        warningToast({
          message: 'Unable to update working schedule',
          description: 'No existing slots found to update. Only pre-defined slots can be activated.'
        })
      }
    } catch {
      // Error handling is done in the mutation callbacks
    }
  }

  const handleSelectSlot = (date: Date, slotIndex: number) => {
    const existingSlotIndex = selectedSlots.findIndex(
      (slot) => format(slot.date, 'EEEE') === format(date, 'EEEE') && slot.slotIndex === slotIndex
    )

    if (existingSlotIndex > -1) {
      // Remove the slot if it already exists
      setSelectedSlots((prevSlots) => prevSlots.filter((_, index) => index !== existingSlotIndex))
    } else {
      // Find if there's a slot with this day and time in the API data
      const apiSlot = slotsData?.data?.find((slot) => {
        const dayName = weekDayToDayName[slot.weekDay]
        const slotDate = getDateForDayName(dayName)
        return (
          slotDate &&
          format(slotDate, 'EEEE') === format(date, 'EEEE') &&
          getSlotIndexFromTime(slot.startTime) === slotIndex
        )
      })

      // Add the slot with its ID if it exists in the API data
      setSelectedSlots((prevSlots) => [...prevSlots, { date, slotIndex, id: apiSlot?.id }])
    }
  }

  // Support bulk operations from TimeSlotPicker
  const handleBulkSlotChange = (slots: Array<{ date: Date; slotIndex: number }>, isSelected: boolean) => {
    if (isSelected) {
      // Add all slots that don't already exist
      setSelectedSlots((prevSlots) => {
        const newSlots = [...prevSlots]

        slots.forEach((slot) => {
          const exists = prevSlots.some(
            (existingSlot) =>
              format(existingSlot.date, 'EEEE') === format(slot.date, 'EEEE') &&
              existingSlot.slotIndex === slot.slotIndex
          )

          if (!exists) {
            // Find if there's a slot with this day and time in the API data
            const apiSlot = slotsData?.data?.find((s) => {
              const dayName = weekDayToDayName[s.weekDay]
              const slotDate = getDateForDayName(dayName)
              return (
                slotDate &&
                format(slotDate, 'EEEE') === format(slot.date, 'EEEE') &&
                getSlotIndexFromTime(s.startTime) === slot.slotIndex
              )
            })

            newSlots.push({
              date: slot.date,
              slotIndex: slot.slotIndex,
              id: apiSlot?.id
            })
          }
        })

        return newSlots
      })
    } else {
      // Remove all slots that were passed
      setSelectedSlots((prevSlots) => {
        return prevSlots.filter((existingSlot) => {
          return !slots.some(
            (slotToRemove) =>
              format(existingSlot.date, 'EEEE') === format(slotToRemove.date, 'EEEE') &&
              existingSlot.slotIndex === slotToRemove.slotIndex
          )
        })
      })
    }
  }

  // Determine if we're submitting any kind of request
  const isSubmitting = isUpdating

  return (
    <Card className='shadow-md'>
      <CardContent className='p-6'>
        <Form {...form}>
          <form
            className='space-y-6'
            id={id}
            onSubmit={(e) => {
              // Prevent default form submission which could cause page redirection
              e.preventDefault()
            }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
              <TabsList className='grid w-fit grid-cols-2 mb-2'>
                <TabsTrigger value='schedule' className='flex items-center gap-2'>
                  <Clock className='h-4 w-4' />
                  Schedule
                </TabsTrigger>
                <TabsTrigger value='summary' className='flex items-center gap-2'>
                  <AlarmClock className='h-4 w-4' />
                  Summary
                </TabsTrigger>
              </TabsList>
              <TabsContent value='schedule' className='border-none p-0 pt-4'>
                {isLoading ? (
                  <div className='flex justify-center items-center py-20'>
                    <div className='text-center'>
                      <Clock className='h-12 w-12 mx-auto mb-3 text-primary/50 animate-pulse' />
                      <p className='text-foreground font-medium mb-1'>Loading your schedule...</p>
                    </div>
                  </div>
                ) : (
                  <TimeSlotPicker
                    selectedSlots={selectedSlots}
                    onSelectSlot={handleSelectSlot}
                    onBulkSlotChange={handleBulkSlotChange}
                    disabledSlots={[]}
                  />
                )}
              </TabsContent>
              <TabsContent value='summary' className='space-y-4 border-none p-0 pt-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <Clock className='h-5 w-5 text-primary' />
                  <h3 className='text-lg font-medium'>Selected Time Slots</h3>
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {selectedSlots.length > 0 ? (
                    // Group slots by day
                    Object.entries(
                      selectedSlots.reduce(
                        (acc, slot) => {
                          const dayName = format(slot.date, 'EEEE')
                          if (!acc[dayName]) {
                            acc[dayName] = []
                          }
                          acc[dayName].push(slot)
                          return acc
                        },
                        {} as Record<string, { date: Date; slotIndex: number; id?: string }[]>
                      )
                    ).map(([dayName, slots]) => {
                      // Sort slots by time
                      const sortedSlots = [...slots].sort((a, b) => a.slotIndex - b.slotIndex)
                      return (
                        <Card key={dayName} className='overflow-hidden border-border hover:shadow-md transition-shadow'>
                          <div className='bg-primary/10 py-3 px-4 border-b border-border'>
                            <div className='flex justify-between items-center'>
                              <h4 className='font-bold text-foreground'>{dayName}</h4>
                              <span className='text-xs font-medium bg-background rounded-full px-2 py-1 shadow-sm'>
                                {sortedSlots.length} {sortedSlots.length === 1 ? 'slot' : 'slots'}
                              </span>
                            </div>
                          </div>
                          <CardContent className='p-4'>
                            <ul className='space-y-2'>
                              {sortedSlots.map((slot) => {
                                const startHour = slot.slotIndex
                                const endHour = startHour + 1
                                return (
                                  <li
                                    key={`${dayName}-${slot.slotIndex}`}
                                    className='text-sm bg-muted px-3 py-2 rounded-md flex items-center justify-between'
                                  >
                                    <div className='flex items-center'>
                                      <Clock className='h-3.5 w-3.5 text-primary mr-2' />
                                      <span className='font-medium'>{startHour.toString().padStart(2, '0')}:00</span>
                                    </div>
                                    <span className='text-muted-foreground'>→</span>
                                    <span>{endHour.toString().padStart(2, '0')}:00</span>
                                  </li>
                                )
                              })}
                            </ul>
                          </CardContent>
                        </Card>
                      )
                    })
                  ) : (
                    <div className='col-span-full text-center p-8 rounded-lg border border-dashed border-primary/30 bg-primary/5'>
                      <Clock className='h-12 w-12 mx-auto mb-3 text-primary/50' />
                      <p className='text-foreground font-medium mb-1'>No time slots selected yet</p>
                      <p className='text-sm text-muted-foreground'>
                        Go to the Schedule tab to select your available slots
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className='flex justify-end pt-4 border-t border-border mt-6'>
              <Button
                type='button'
                className='gap-2'
                onClick={handleManualSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                <SaveIcon className='h-4 w-4' />
                Save Schedule
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
