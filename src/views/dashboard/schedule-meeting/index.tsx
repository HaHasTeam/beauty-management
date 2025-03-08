import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { addDays, format } from 'date-fns'
import { CalendarIcon, ChevronRight, Clock, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as z from 'zod'
import { useShallow } from 'zustand/react/shallow'

import Button from '@/components/button'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'
import { createBookingApi } from '@/network/apis/booking'
import { getAvailableSlotsApi } from '@/network/apis/slots'
import { useStore } from '@/stores/store'
import { BookingStatusEnum, BookingTypeEnum } from '@/types/enum'
import type { TSlot } from '@/types/slot'

const formSchema = z.object({
  selectedDate: z.date({
    required_error: 'Please select a date'
  }),
  slotId: z.string({
    required_error: 'Please select a time slot'
  }),
  notes: z.string().optional()
})

type FormValues = z.infer<typeof formSchema>
export const url = import.meta.env.VITE_SITE_URL
function ScheduleMeeting() {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const handleServerError = useHandleServerError()
  const { errorToast, successToast } = useToast()
  const { user } = useStore(
    useShallow((state) => {
      return {
        user: state.user
      }
    })
  )
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: ''
    }
  })

  const { mutateAsync: mutateCreateBooking, isPending: isBookingPending } = useMutation({
    mutationKey: [createBookingApi.mutationKey],
    mutationFn: createBookingApi.fn,
    onSuccess: () => {
      successToast({
        message: 'Your appointment is confirmed! See you soon.'
      })
      // Navigate to dashboard/Schedule on success
      navigate('/dashboard/Schedule')
    }
  })

  const {
    mutateAsync: getAvailableSlotMutate,
    isPending,
    error
  } = useMutation({
    mutationKey: [getAvailableSlotsApi.mutationKey],
    mutationFn: getAvailableSlotsApi.fn
  })

  const handleRoomIdGenerate = () => {
    const randomId = Math.random().toString(36).substring(2, 9)
    const timestamp = Date.now().toString().substring(-4)
    return `${url}/room/${randomId + timestamp}?type=one-on-one`
  }

  const [availableSlots, setAvailableSlots] = useState<TSlot[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)

  const onSubmit = async (data: FormValues) => {
    try {
      const selectedSlot = availableSlots.find((slot) => slot.id === data.slotId)
      if (!selectedSlot) {
        errorToast({ message: 'Error there is no slot selected', isShowDescription: false })
        return
      }

      const formattedDate = format(data.selectedDate, 'yyyy-MM-dd')
      const startTime = `${formattedDate}T${selectedSlot.startTime}:00`
      const endTime = `${formattedDate}T${selectedSlot.endTime}:00`

      // Generate the meeting URL here
      const meetUrl = handleRoomIdGenerate()
      const payload = {
        startTime,
        endTime,
        notes: data.notes,
        type: BookingTypeEnum.INTERVIEW,
        meetUrl: meetUrl,
        status: BookingStatusEnum.WAIT_FOR_CONFIRMATION,
        slot: data.slotId,
        account: user.id
      }
      await mutateCreateBooking(payload)
      // Form will be reset and navigation will happen in onSuccess callback
    } catch (error) {
      // Don't reset form on error, just show the error message
      handleServerError({
        error,
        form
      })
      errorToast({
        message: 'Failed to schedule interview. Please try again.',
        isShowDescription: true,
        description: 'There was an error processing your request.'
      })
    }
  }

  if (isPending) return <LoadingContentLayer />
  if (error) return <div>Error loading slots: {error.message}</div>

  return (
    <Card className='w-full max-w-3xl mx-auto shadow-md'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Schedule Your Interview</CardTitle>
        <CardDescription>
          Please select a date and time slot for your interview. Make sure you'll be available for the entire duration
          of the selected slot.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='selectedDate'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className='text-base font-medium mb-1'>
                      Select Date
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className='h-4 w-4 inline-block ml-1' />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Choose a date for your interview. Only available dates are selectable.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={async (date) => {
                            field.onChange(date)
                            setSelectedDate(date)
                            form.setValue('slotId', '')

                            if (date) {
                              setIsLoadingSlots(true)
                              try {
                                // Format the date for the API payload
                                const formattedDate = format(date, 'yyyy-MM-dd')
                                // Create start and end date for the full day
                                const startDate = `${formattedDate}T00:00:00`
                                const endDate = `${formattedDate}T23:59:59` // Fixed: Set to end of day

                                // Call API with the correct payload structure
                                const response = await getAvailableSlotMutate({
                                  startDate,
                                  endDate
                                })

                                if (response.data) {
                                  setAvailableSlots(response.data)
                                }
                              } catch (error) {
                                handleServerError({ error })
                                errorToast({ message: 'Failed to load available slots', isShowDescription: false })
                              } finally {
                                setIsLoadingSlots(false)
                              }
                            }
                          }}
                          disabled={(date) =>
                            date < new Date() || date > addDays(new Date(), 30) || [0, 6].includes(date.getDay())
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Interviews are available on weekdays for the next 30 days.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedDate && (
                <FormField
                  control={form.control}
                  name='slotId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-base font-medium mb-1'>
                        Select Time Slot
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className='h-4 w-4 inline-block ml-1' />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Choose a time slot that works best for you. Each slot is one hour long.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      {isLoadingSlots ? (
                        <div className='flex justify-center py-4'>
                          <LoadingContentLayer />
                        </div>
                      ) : availableSlots.length > 0 ? (
                        <div className='grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto'>
                          {availableSlots.map((slot) => (
                            <Button
                              key={slot.id}
                              type='button'
                              variant={field.value === slot.id ? 'default' : 'outline'}
                              className={cn(
                                'transition-colors justify-start',
                                field.value === slot.id ? 'bg-primary text-primary-foreground' : 'bg-background'
                              )}
                              onClick={() => field.onChange(slot.id)}
                            >
                              <Clock className='mr-2 h-4 w-4' />
                              {slot.startTime} - {slot.endTime}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <div className='text-center py-4 text-muted-foreground'>
                          No available slots for this date. Please select another date.
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base font-medium mb-1'>
                    Additional Notes
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className='h-4 w-4 inline-block ml-1' />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add any important information or questions you have for the interviewer.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Add any additional notes or questions here'
                      className='min-h-[100px] resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end'>
              <Button type='submit' disabled={isBookingPending}>
                {isBookingPending ? 'Scheduling...' : 'Schedule Interview'}
                <ChevronRight className='ml-2 h-4 w-4' />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ScheduleMeeting
