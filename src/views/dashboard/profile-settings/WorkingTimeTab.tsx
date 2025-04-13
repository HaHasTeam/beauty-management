/**
 * WorkingTimeTab Component
 *
 * A user interface for beauticians to manage their working time schedule.
 *
 * Features:
 * - Displays available system time slots
 * - Allows beauticians to select when they're available to work
 * - Provides a visual calendar-like interface using TimeSlotPicker
 * - Connects to API endpoints for fetching slots and updating working schedule
 * - Supports bulk selection/deselection of time slots
 * - Provides error handling and feedback through toast notifications
 *
 * API Integrations:
 * - getAllSlotsApi: Fetches available system slots with isActive flag
 * - updateWorkingSlotsApi: Updates the user's selected working slots
 * - getWorkingSlotsOfConsultantApi: Gets consultant's current working slots
 *
 * Slot Matching Logic:
 * The component implements robust slot matching between the consultant's working slots
 * and system slots to handle cases where:
 * 1. The slot IDs between APIs don't match
 * 2. Slots exist in consultant data but not in system data (or vice versa)
 * 3. Slots need to be matched by day and time when IDs don't match
 *
 * This prevents issues where slots might be displayed incorrectly or not at all,
 * and provides helpful warnings to users when slots can't be matched.
 */

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Clock, SaveIcon } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import Button from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { TimeSlotPicker } from '@/components/working-time/TimeSlotPicker'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getAllSlotsApi, getWorkingSlotsOfConsultantApi, updateWorkingSlotsApi } from '@/network/apis/slots'
import { useStore } from '@/stores/store'
import { WeekDay } from '@/types/enum'
import { TSlot } from '@/types/slot'

// Form schema for validation
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

const WorkingTimeTab = () => {
  const [selectedSlots, setSelectedSlots] = useState<{ date: Date; slotIndex: number; id?: string }[]>([])
  const [availableSlots, setAvailableSlots] = useState<{ date: Date; slotIndex: number; id?: string }[]>([])
  const id = useId()
  const queryClient = useQueryClient()

  // Get current user from store
  const { user } = useStore(
    useShallow((state) => ({
      user: state.user
    }))
  )

  // Custom hooks for toast and error handling
  const { successToast, errorToast, warningToast } = useToast()
  const handleServerError = useHandleServerError()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slots: []
    }
  })

  // Map from WeekDay enum to day name
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
    if (!time) {
      // eslint-disable-next-line no-console
      console.warn('Warning: Empty time string received in getSlotIndexFromTime')
      return 0
    }

    try {
      // Handle different time formats like "11:00", "11", etc.
      const timeString = time.trim()
      if (timeString.includes(':')) {
        const hour = parseInt(timeString.split(':')[0], 10)
        return hour
      } else {
        return parseInt(timeString, 10)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error parsing time:', time, error)
      return 0
    }
  }

  // Function to get a date object for a specific day name
  // This ensures consistency with the TimeSlotPicker date creation
  const getDateForDayName = (dayName: string): Date | null => {
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const index = dayOrder.indexOf(dayName)
    if (index === -1) return null

    // Use the same date creation approach as TimeSlotPicker
    // The +2 is because we start from day 0 as December 31, day 1 as January 1, etc.
    const date = new Date(2023, 0, index + 2)

    // Set time to noon to avoid timezone issues
    date.setHours(12, 0, 0, 0)

    return date
  }

  // Convert API slot data format to our component's slot format
  const convertApiSlotsToComponentFormat = (apiSlots: TSlot[]): { date: Date; slotIndex: number; id: string }[] => {
    if (!apiSlots || apiSlots.length === 0) {
      // eslint-disable-next-line no-console
      console.warn('Warning: Empty or null apiSlots received in convertApiSlotsToComponentFormat')
      return []
    }

    // eslint-disable-next-line no-console
    console.log('Converting API slots:', apiSlots)

    // Create a Map to deduplicate slots based on day and time
    const slotMap = new Map<string, { date: Date; slotIndex: number; id: string }>()

    apiSlots.forEach((slot) => {
      if (!slot) return

      // Log each slot we're processing
      // eslint-disable-next-line no-console
      console.log('Processing slot:', slot)

      // Get the day name from the weekDay enum value
      const dayName = weekDayToDayName[slot.weekDay]

      // Log weekDay to dayName mapping
      // eslint-disable-next-line no-console
      console.log(`WeekDay ${slot.weekDay} maps to day name: ${dayName}`)

      if (!dayName) {
        // Skip invalid weekDay values
        // eslint-disable-next-line no-console
        console.warn(`Invalid weekDay value: ${slot.weekDay} for slot:`, slot)
        return
      }

      // Create a date object for the corresponding day
      const date = getDateForDayName(dayName)
      if (!date) {
        // Skip if we couldn't create a valid date
        // eslint-disable-next-line no-console
        console.warn(`Couldn't create date for day: ${dayName}`)
        return
      }

      // Convert the time string to slot index
      const slotIndex = getSlotIndexFromTime(slot.startTime)

      // Log the created slot
      // eslint-disable-next-line no-console
      console.log(`Created slot: id=${slot.id}, day=${dayName}, slotIndex=${slotIndex}, date=${date.toISOString()}`)

      // Create a unique key for this day+time combination
      const key = `${dayName}-${slotIndex}`

      // Only add this slot if it doesn't already exist in our map
      if (!slotMap.has(key)) {
        slotMap.set(key, { date, slotIndex, id: slot.id })
      } else {
        // eslint-disable-next-line no-console
        console.warn(`Duplicate slot found for ${key}, existing id: ${slotMap.get(key)?.id}, new id: ${slot.id}`)
      }
    })

    // Convert map back to array
    const result = Array.from(slotMap.values())

    // eslint-disable-next-line no-console
    console.log(`Converted ${apiSlots.length} API slots to ${result.length} unique component slots:`, result)

    return result
  }

  // Use React Query to fetch available slots from the system
  const { data: slotsData, isLoading: isLoadingSlots } = useQuery({
    queryKey: [getAllSlotsApi.queryKey],
    queryFn: () => getAllSlotsApi.fn({ queryKey: [getAllSlotsApi.queryKey] })
  })

  // Use React Query to fetch the consultant's working slots using the API function
  const {
    data: consultantSlotsData,
    isLoading: isLoadingConsultantSlots,
    error: consultantError
  } = useQuery({
    queryKey: [getWorkingSlotsOfConsultantApi.queryKey, user?.id] as [string, string],
    queryFn: async ({ queryKey }) => {
      if (!user?.id) return { data: [] }
      try {
        // Call the API function with the queryKey parameter
        return await getWorkingSlotsOfConsultantApi.fn({ queryKey })
      } catch {
        // Return empty data to avoid breaking the UI completely
        return { data: [] }
      }
    },
    enabled: !!user?.id,
    retry: 1, // Only retry once to avoid too many failed requests
    retryDelay: 1000
  })

  // Add useEffect to handle API errors
  useEffect(() => {
    if (consultantError) {
      errorToast({
        message: 'Failed to load working slots',
        description: 'There was an issue loading your working time slots. Please try again later.'
      })
    }
  }, [consultantError, errorToast])

  // Process the system slots data to get only active slots
  useEffect(() => {
    if (slotsData?.data) {
      // Filter only active slots from the system (isActive: true)
      const activeSystemSlots = slotsData.data.filter((slot) => slot.isActive === true)

      // Convert active slots to our component format
      const convertedActiveSlots = convertApiSlotsToComponentFormat(activeSystemSlots)

      // Set available slots for the TimeSlotPicker - these are the ACTIVE system slots
      setAvailableSlots(convertedActiveSlots)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotsData?.data])

  // Check if there are no available slots even after loading
  const hasNoAvailableSlots = !isLoadingSlots && slotsData?.data && availableSlots.length === 0

  // Add useEffect to initialize selectedSlots properly from consultantSlotsData
  useEffect(() => {
    if (consultantSlotsData?.data && consultantSlotsData.data.length > 0) {
      // Convert consultant's working slots to component format
      const consultantWorkingSlots = convertApiSlotsToComponentFormat(consultantSlotsData.data)
      setSelectedSlots(consultantWorkingSlots)
    } else {
      // Initialize with empty array when consultant has no slots
      setSelectedSlots([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultantSlotsData?.data])

  // Helper function to match slots by day and time - we'll use this in UI display logic
  const matchSlotByDayAndTime = (
    slot1: { date: Date; slotIndex: number },
    slot2: { date: Date; slotIndex: number }
  ) => {
    const day1 = format(slot1.date, 'EEEE')
    const day2 = format(slot2.date, 'EEEE')
    return day1 === day2 && slot1.slotIndex === slot2.slotIndex
  }

  // Add a useEffect to show a warning if consultant slots aren't in the system
  useEffect(() => {
    if (selectedSlots.length > 0 && availableSlots.length > 0) {
      // Check which selected slots aren't in the available slots
      const unavailableSlots = selectedSlots.filter((selectedSlot) => {
        return !availableSlots.some(
          (availableSlot) => availableSlot.id === selectedSlot.id || matchSlotByDayAndTime(selectedSlot, availableSlot)
        )
      })

      if (unavailableSlots.length > 0) {
        // Log the unavailable slots
        // eslint-disable-next-line no-console
        console.log("Slots selected that aren't available in the system:", unavailableSlots)

        warningToast({
          message: `${unavailableSlots.length} of your working slots are unavailable`,
          description:
            'Some of your working slots are not available in the system. They may have been deactivated by an administrator.'
        })
      }
    }
  }, [selectedSlots, availableSlots, warningToast])

  // Use React Query mutation for updating working slots
  const { mutateAsync: updateWorkingSlots, isPending: isUpdating } = useMutation({
    mutationKey: [updateWorkingSlotsApi.mutationKey],
    mutationFn: (data: { slotIds: string[] }) => updateWorkingSlotsApi.fn(data),
    onSuccess: () => {
      successToast({
        message: 'Working schedule updated successfully',
        description: 'Your working time slots have been updated'
      })

      // Invalidate and refetch the slots query
      queryClient.invalidateQueries({ queryKey: [getAllSlotsApi.queryKey] })
      queryClient.invalidateQueries({ queryKey: [getWorkingSlotsOfConsultantApi.queryKey, user?.id] })

      // Reset initialization flag to allow re-initialization with new data
    },
    onError: (error) => {
      handleServerError({ error, form })
      errorToast({
        message: 'Failed to update working schedule',
        description: 'There was an error updating your working time slots'
      })
    }
  })

  // Create a manual submit handler
  const handleManualSubmit = async () => {
    if (selectedSlots.length === 0) {
      warningToast({
        message: 'Please select at least one time slot',
        description: 'You need to select time slots to save your working schedule'
      })
      return
    }

    try {
      // Extract slot IDs from selected slots
      let slotIds = selectedSlots
        .filter((slot) => slot.id) // Only include slots that have IDs
        .map((slot) => slot.id!) // Extract the ID

      // Log the slot IDs we're about to save
      // eslint-disable-next-line no-console
      console.log('About to save these slot IDs:', slotIds)

      // Make sure these slots exist in the available slots or have matching day/time
      const validSlotIds = slotIds.filter((id) => {
        const selectedSlot = selectedSlots.find((s) => s.id === id)
        if (!selectedSlot) return false

        return availableSlots.some(
          (availableSlot) =>
            availableSlot.id === id || (selectedSlot && matchSlotByDayAndTime(selectedSlot, availableSlot))
        )
      })

      // If the list changed, log the difference
      if (validSlotIds.length !== slotIds.length) {
        // eslint-disable-next-line no-console
        console.log('Some selected slots were filtered out as invalid. Valid IDs:', validSlotIds)

        warningToast({
          message: `${slotIds.length - validSlotIds.length} slots filtered out`,
          description: 'Some selected slots are not available in the system and were excluded from the update.'
        })
      }

      slotIds = validSlotIds

      // If we have slot IDs, update the working slots
      if (slotIds.length > 0) {
        await updateWorkingSlots({ slotIds })
        queryClient.invalidateQueries({ queryKey: [getWorkingSlotsOfConsultantApi.queryKey, user?.id] })
      } else {
        // Currently we only support selecting from existing system slots
        warningToast({
          message: 'Unable to update working schedule',
          description: 'No valid slots selected. Please select from the available time slots.'
        })
      }
    } catch {
      // Error handling is done in the mutation callbacks
    }
  }

  const handleSelectSlot = (date: Date, slotIndex: number) => {
    // Normalize the date format by using the day name
    const dayName = format(date, 'EEEE')

    const existingSlotIndex = selectedSlots.findIndex(
      (slot) => format(slot.date, 'EEEE') === dayName && slot.slotIndex === slotIndex
    )

    if (existingSlotIndex > -1) {
      // Remove the slot if it already exists
      setSelectedSlots((prevSlots) => prevSlots.filter((_, index) => index !== existingSlotIndex))
    } else {
      // Find if there's a slot with this day and time in the available slots
      const availableSlot = availableSlots.find(
        (slot) => format(slot.date, 'EEEE') === dayName && slot.slotIndex === slotIndex
      )

      // Only add if it exists in available slots
      if (availableSlot) {
        setSelectedSlots((prevSlots) => [...prevSlots, { ...availableSlot }])
      }
    }
  }

  // Support bulk operations from TimeSlotPicker
  const handleBulkSlotChange = (slots: Array<{ date: Date; slotIndex: number }>, isSelected: boolean) => {
    if (isSelected) {
      // Add all slots that don't already exist
      setSelectedSlots((prevSlots) => {
        const newSlots = [...prevSlots]

        slots.forEach((slot) => {
          // Normalize the date format by using the day name
          const dayName = format(slot.date, 'EEEE')

          const exists = prevSlots.some(
            (existingSlot) => format(existingSlot.date, 'EEEE') === dayName && existingSlot.slotIndex === slot.slotIndex
          )

          if (!exists) {
            // Find if there's a slot with this day and time in the available slots
            const availableSlot = availableSlots.find(
              (available) => format(available.date, 'EEEE') === dayName && available.slotIndex === slot.slotIndex
            )

            if (availableSlot) {
              newSlots.push({ ...availableSlot })
            }
          }
        })

        return newSlots
      })
    } else {
      // Remove all slots that were passed
      setSelectedSlots((prevSlots) => {
        return prevSlots.filter((existingSlot) => {
          return !slots.some((slotToRemove) => {
            // Normalize the date format by using the day name
            const dayName = format(slotToRemove.date, 'EEEE')
            return format(existingSlot.date, 'EEEE') === dayName && existingSlot.slotIndex === slotToRemove.slotIndex
          })
        })
      })
    }
  }

  // Determine if we're submitting any kind of request or loading data
  const isLoading = isLoadingSlots || isLoadingConsultantSlots

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Clock className='h-4 w-4' />
          Working Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className='space-y-6'
            id={id}
            onSubmit={(e) => {
              // Prevent default form submission
              e.preventDefault()
            }}
          >
            {isLoading ? (
              <div className='flex justify-center items-center py-20'>
                <div className='text-center'>
                  <Clock className='h-12 w-12 mx-auto mb-3 text-primary/50 animate-pulse' />
                  <p className='text-foreground font-medium mb-1'>Loading available time slots...</p>
                </div>
              </div>
            ) : consultantError ? (
              <div className='flex justify-center items-center py-20 border border-dashed border-destructive/30 rounded-md bg-destructive/5'>
                <div className='text-center'>
                  <Clock className='h-12 w-12 mx-auto mb-3 text-destructive/50' />
                  <p className='text-foreground font-medium mb-1'>Unable to load time slots</p>
                  <p className='text-sm text-muted-foreground mb-4'>
                    Authentication issues occurred while loading your working time slots
                  </p>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      // Invalidate and refetch
                      queryClient.invalidateQueries({ queryKey: [getWorkingSlotsOfConsultantApi.queryKey, user?.id] })
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : hasNoAvailableSlots ? (
              <div className='flex justify-center items-center py-20 border border-dashed border-muted-foreground/50 rounded-md'>
                <div className='text-center'>
                  <Clock className='h-12 w-12 mx-auto mb-3 text-muted-foreground/50' />
                  <p className='text-foreground font-medium mb-1'>No time slots available</p>
                  <p className='text-sm text-muted-foreground mb-4'>
                    There are no active time slots set up in the system
                  </p>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      // Refresh data
                      queryClient.invalidateQueries({ queryKey: [getAllSlotsApi.queryKey] })
                    }}
                  >
                    Refresh Data
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <TimeSlotPicker
                  selectedSlots={selectedSlots}
                  onSelectSlot={handleSelectSlot}
                  onBulkSlotChange={handleBulkSlotChange}
                  slotType='working'
                  activeSlots={availableSlots}
                  startTime={0}
                  endTime={24}
                  maxHeight={500} // Limit height for better UX
                />
              </>
            )}
          </form>
          <div className='flex justify-end mt-8'>
            <Button type='submit' form={`id`} loading={isUpdating} onClick={handleManualSubmit} className=''>
              <SaveIcon />
              Save Schedule
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  )
}

export default WorkingTimeTab
