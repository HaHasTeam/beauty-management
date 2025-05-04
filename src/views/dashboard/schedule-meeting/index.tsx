'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { addDays, format } from 'date-fns'
import {
  Building,
  CalendarIcon,
  CalendarPlus2Icon as CalendarIcon2,
  ChevronRight,
  ClipboardList,
  Clock,
  HelpCircle,
  Mail,
  Phone,
  ShieldCheck,
  User
} from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as z from 'zod'
import { useShallow } from 'zustand/react/shallow'

import Button from '@/components/button'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'
import { createBookingApi } from '@/network/apis/booking'
import { getSomeoneSlotApi } from '@/network/apis/slots'
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
        message: 'Your registration meeting has been scheduled successfully!'
      })
      // Navigate to dashboard/Schedule on success
      navigate('/dashboard/Schedule')
    }
  })
  const reviewer = user?.brands?.[0]?.reviewer || ''
  const {
    mutateAsync: getAvailableSlotMutate,
    isPending,
    error
  } = useMutation({
    mutationKey: [getSomeoneSlotApi.mutationKey],
    mutationFn: getSomeoneSlotApi.fn
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
        brandId: user?.brands?.[0]?.id ?? ''
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
        message: 'Failed to schedule meeting. Please try again.',
        isShowDescription: true,
        description: 'There was an error processing your request.'
      })
    }
  }

  if (isPending) return <LoadingContentLayer />
  if (error) return <div>Error loading slots: {error.message}</div>

  return (
    <div className='max-w-5xl mx-auto'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold tracking-tight'>Schedule Registration Meeting</h1>
        <p className='text-muted-foreground mt-1'>
          Schedule a meeting with a system operator to complete your brand registration process.
        </p>
      </div>

      <Alert className='mb-6 border-primary/20 bg-primary/5'>
        <ShieldCheck className='h-5 w-5 text-primary' />
        <AlertTitle>Registration Process</AlertTitle>
        <AlertDescription>
          This meeting is a required step to verify your brand information and complete the registration process. The
          system operator will review your application and answer any questions you may have.
        </AlertDescription>
      </Alert>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left sidebar with participant information */}
        <div className='lg:col-span-1 space-y-6'>
          {/* Reviewer Information */}
          <Card className='border shadow-sm'>
            <CardHeader className='bg-muted/30 pb-3'>
              <CardTitle className='text-lg font-semibold flex items-center'>
                <ShieldCheck className='h-5 w-5 mr-2 text-primary' />
                Reviewer Information
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-4'>
              <div className='flex flex-col space-y-4'>
                <div className='flex items-center space-x-3'>
                  <Avatar className='h-16 w-16 border'>
                    <AvatarImage src={reviewer && 'avatar' in reviewer ? reviewer.avatar : undefined} alt='Reviewer' />
                    <AvatarFallback className='text-lg bg-primary/10 text-primary'>
                      {reviewer && typeof reviewer === 'object' && 'email' in reviewer
                        ? `${reviewer.email?.charAt(0) || ''}`
                        : typeof reviewer === 'string' && reviewer.length > 0
                          ? reviewer.charAt(0).toUpperCase()
                          : 'RV'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className='font-semibold text-lg'>
                      {reviewer && 'firstName' in reviewer
                        ? `${reviewer.firstName || ''} ${reviewer.lastName || ''}`
                        : 'Reviewer'}
                    </h3>
                    <Badge variant='outline' className='mt-1'>
                      {reviewer && 'role' in reviewer ? reviewer.role : 'Platform Representative'}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className='space-y-2'>
                  <div className='flex items-start'>
                    <Mail className='h-4 w-4 mr-2 mt-0.5 text-muted-foreground' />
                    <span className='text-sm'>{reviewer && 'email' in reviewer ? reviewer.email : 'reviewer'}</span>
                  </div>
                  {reviewer && 'phone' in reviewer && reviewer.phone && (
                    <div className='flex items-start'>
                      <Phone className='h-4 w-4 mr-2 mt-0.5 text-muted-foreground' />
                      <span className='text-sm'>{reviewer.phone}</span>
                    </div>
                  )}

                  {reviewer && 'username' in reviewer && (
                    <div className='flex items-start'>
                      <User className='h-4 w-4 mr-2 mt-0.5 text-muted-foreground' />
                      <span className='text-sm'>{reviewer.username}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <h4 className='text-sm font-medium mb-1'>About</h4>
                  <p className='text-sm text-muted-foreground'>
                    The reviewer will verify your brand information, explain the platform features, and help you
                    complete the registration process.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Brand Information */}
          <Card className='border shadow-sm'>
            <CardHeader className='bg-muted/30 pb-3'>
              <CardTitle className='text-lg font-semibold flex items-center'>
                <Building className='h-5 w-5 mr-2 text-primary' />
                Your Brand Information
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-4'>
              <div className='flex flex-col space-y-4'>
                <div className='flex items-center space-x-3'>
                  <Avatar className='h-12 w-12 border'>
                    <AvatarImage src={user?.brands?.[0]?.logo || undefined} alt={user?.brands?.[0]?.name || 'Brand'} />
                    <AvatarFallback className='bg-secondary/20 text-secondary'>
                      {user?.brands?.[0]?.name?.substring(0, 2).toUpperCase() || 'BR'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className='font-medium'>{user?.brands?.[0]?.name || 'FaceReco'}</h3>
                    <Badge variant='outline' className='mt-1'>
                      Brand Representative
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className='space-y-2'>
                  <div className='flex items-start'>
                    <User className='h-4 w-4 mr-2 mt-0.5 text-muted-foreground' />
                    <span className='text-sm'>{user?.username || 'Not available'}</span>
                  </div>
                  <div className='flex items-start'>
                    <Mail className='h-4 w-4 mr-2 mt-0.5 text-muted-foreground' />
                    <span className='text-sm'>{user?.email || 'No email available'}</span>
                  </div>
                  {user?.phone && (
                    <div className='flex items-start'>
                      <Phone className='h-4 w-4 mr-2 mt-0.5 text-muted-foreground' />
                      <span className='text-sm'>{user?.phone}</span>
                    </div>
                  )}
                </div>

                {user?.brands?.[0]?.description && (
                  <>
                    <Separator />
                    <div>
                      <h4 className='text-sm font-medium mb-1'>Brand Description</h4>
                      <p className='text-sm text-muted-foreground'>{user?.brands?.[0]?.description}</p>
                    </div>
                  </>
                )}

                {user?.brands?.[0]?.status && (
                  <>
                    <Separator />
                    <div>
                      <h4 className='text-sm font-medium mb-1'>Registration Status</h4>
                      <Badge variant='outline' className='bg-amber-50 text-amber-700 border-amber-200'>
                        {user?.brands?.[0]?.status}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side with scheduling form */}
        <div className='lg:col-span-2'>
          <Card className='border shadow-sm'>
            <CardHeader className='bg-muted/30 pb-3 border-b'>
              <CardTitle className='text-xl font-semibold flex items-center'>
                <CalendarIcon2 className='h-5 w-5 mr-2 text-primary' />
                Schedule Your Registration Meeting
              </CardTitle>
              <CardDescription>
                Please select a date and time for your meeting with the system operator to complete your brand
                registration.
              </CardDescription>
            </CardHeader>
            <CardContent className='pt-6'>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                  <div className='space-y-6'>
                    {/* Step 1: Select Date */}
                    <div className='space-y-2'>
                      <h3 className='text-base font-semibold flex items-center'>
                        <span className='flex items-center justify-center rounded-full bg-primary/10 text-primary w-6 h-6 text-sm mr-2'>
                          1
                        </span>
                        Select Meeting Date
                      </h3>

                      <FormField
                        control={form.control}
                        name='selectedDate'
                        render={({ field }) => (
                          <FormItem className='flex flex-col'>
                            <div className='flex justify-between items-center'>
                              <FormLabel className='text-sm font-medium mb-1'>Available Dates</FormLabel>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className='h-4 w-4 text-muted-foreground' />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Choose a date for your registration meeting. Only available dates are selectable.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant='outline'
                                    className={cn(
                                      'w-full justify-start text-left font-normal',
                                      !field.value && 'text-muted-foreground'
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, 'EEEE, MMMM d, yyyy')
                                    ) : (
                                      <span>Select a date</span>
                                    )}
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
                                        const endDate = `${formattedDate}T23:59:59`

                                        // Call API with the correct payload structure
                                        const response = await getAvailableSlotMutate({
                                          startDate: startDate,
                                          endDate: endDate,
                                          id:
                                            reviewer && typeof reviewer === 'object' && 'id' in reviewer
                                              ? reviewer.id
                                              : undefined
                                        })

                                        if (response.data) {
                                          setAvailableSlots(response.data)
                                        }
                                      } catch (error) {
                                        handleServerError({ error })
                                        errorToast({
                                          message: 'Failed to load available slots',
                                          isShowDescription: false
                                        })
                                      } finally {
                                        setIsLoadingSlots(false)
                                      }
                                    }
                                  }}
                                  disabled={(date) =>
                                    date < new Date() ||
                                    date > addDays(new Date(), 30) ||
                                    [0, 6].includes(date.getDay())
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              Registration meetings are available on weekdays for the next 30 days.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Step 2: Select Time Slot */}
                    {selectedDate && (
                      <div className='space-y-2'>
                        <h3 className='text-base font-semibold flex items-center'>
                          <span className='flex items-center justify-center rounded-full bg-primary/10 text-primary w-6 h-6 text-sm mr-2'>
                            2
                          </span>
                          Select Time Slot
                        </h3>

                        <FormField
                          control={form.control}
                          name='slotId'
                          render={({ field }) => (
                            <FormItem>
                              <div className='flex justify-between items-center'>
                                <FormLabel className='text-sm font-medium mb-1'>
                                  Available Times for {format(selectedDate, 'MMMM d, yyyy')}
                                </FormLabel>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className='h-4 w-4 text-muted-foreground' />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Choose a time slot that works best for your schedule.</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>

                              {isLoadingSlots ? (
                                <div className='flex justify-center py-8'>
                                  <LoadingContentLayer />
                                </div>
                              ) : availableSlots.length > 0 ? (
                                <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto p-1'>
                                  {availableSlots.map((slot) => (
                                    <Button
                                      key={slot.id}
                                      type='button'
                                      variant={field.value === slot.id ? 'default' : 'outline'}
                                      className={cn(
                                        'transition-colors justify-start h-auto py-3',
                                        field.value === slot.id ? 'bg-primary text-primary-foreground' : 'bg-background'
                                      )}
                                      onClick={() => field.onChange(slot.id)}
                                    >
                                      <Clock className='mr-2 h-4 w-4 flex-shrink-0' />
                                      <span>
                                        {slot.startTime} - {slot.endTime}
                                      </span>
                                    </Button>
                                  ))}
                                </div>
                              ) : (
                                <div className='text-center py-8 px-4 border rounded-md bg-muted/20'>
                                  <ClipboardList className='h-8 w-8 mx-auto text-muted-foreground mb-2' />
                                  <p className='text-muted-foreground font-medium'>No available slots for this date.</p>
                                  <p className='text-sm text-muted-foreground mt-1'>
                                    Please select another date to see available times.
                                  </p>
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Step 3: Additional Notes */}
                    <div className='space-y-2'>
                      <h3 className='text-base font-semibold flex items-center'>
                        <span className='flex items-center justify-center rounded-full bg-primary/10 text-primary w-6 h-6 text-sm mr-2'>
                          3
                        </span>
                        Additional Information
                      </h3>

                      <FormField
                        control={form.control}
                        name='notes'
                        render={({ field }) => (
                          <FormItem>
                            <div className='flex justify-between items-center'>
                              <FormLabel className='text-sm font-medium mb-1'>
                                Notes for the System Operator (Optional)
                              </FormLabel>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className='h-4 w-4 text-muted-foreground' />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Add any questions or information you'd like to discuss during the registration
                                      meeting.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <FormControl>
                              <Textarea
                                placeholder="Add any questions about the registration process, specific requirements, or topics you'd like to discuss during the meeting"
                                className='min-h-[120px] resize-none'
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              This information will help the system operator prepare for your registration meeting.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className='bg-muted/20 border-t flex justify-between pt-4'>
              <Button variant='outline' onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isBookingPending || !form.formState.isValid}
                className='min-w-[150px]'
              >
                {isBookingPending ? 'Scheduling...' : 'Confirm Meeting'}
                <ChevronRight className='ml-2 h-4 w-4' />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ScheduleMeeting
