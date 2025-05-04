import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { forwardRef, HtmlHTMLAttributes, useEffect, useState } from 'react'
import { ControllerFieldState, FieldValues, useForm, UseFormReturn } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form, FormControl } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import { Calendar } from '../ui/calendar'
import { ScrollArea } from '../ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

type Props<TFieldValues extends FieldValues> = {
  field: React.InputHTMLAttributes<HTMLInputElement>
  formState?: UseFormReturn<TFieldValues>
  fieldState?: ControllerFieldState
  onlyFutureDates?: boolean
  onlyPastDates?: boolean
  showTime?: boolean
  buttonClassName?: string
  required?: boolean
  label?: string
  className?: HtmlHTMLAttributes<HTMLDivElement>['className']
}
// eslint-disable-next-line
const FlexDatePicker = forwardRef<HTMLButtonElement, Props<any>>(
  (
    {
      field,
      onlyFutureDates,
      onlyPastDates,
      showTime = false,
      buttonClassName,
      required = false,
      label = 'Select Date',
      className
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(field.value ? new Date(field.value as string) : undefined)
    const [time, setTime] = useState<string>('21:00')
    const form = useForm()
    const handlePickDate = (selectedDate: Date) => {
      setDate(selectedDate)
      if (field.onChange) field.onChange(selectedDate.toUTCString() as unknown as React.ChangeEvent<HTMLInputElement>)
    }

    useEffect(() => {
      if (field.value) {
        setDate(field.value ? new Date(field.value as string) : undefined)
        const time = format(new Date(field.value as string), 'HH:mm')
        setTime(time)
      } else {
        setDate(undefined)
      }
    }, [field.value])

    return (
      <Form {...form}>
        <div className='flex items-center'>
          <Popover open={isOpen} onOpenChange={setIsOpen} modal={false}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  ref={ref}
                  variant={'outline'}
                  className={cn(
                    `flex-1 space-x-2 font-normal overflow-clip ${buttonClassName} `,
                    showTime ? 'rounded-none rounded-l-lg' : 'rounded-lg',
                    !field.value && 'text-muted-foreground',
                    className
                  )}
                >
                  <div className='w-full flex items-center justify-between gap-2'>
                    <span className=''>{date ? `${format(date, 'PPP')} ` : <span>{label}</span>}</span>
                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                  </div>
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0 flex items-start' align='start'>
              <Calendar
                mode='single'
                captionLayout='dropdown'
                selected={date}
                onSelect={(selectedDate) => {
                  const [hours, minutes] = time.split(':')
                  selectedDate?.setHours(parseInt(hours), parseInt(minutes))
                  handlePickDate(selectedDate!)
                }}
                onDayClick={() => setIsOpen(false)}
                fromYear={1950}
                toYear={new Date().getFullYear() + 100}
                disabled={(date) => {
                  const nowAtMidnight = new Date()
                  nowAtMidnight.setHours(0, 0, 0, 0)
                  if (onlyFutureDates) {
                    return date < nowAtMidnight
                  }
                  if (onlyPastDates) {
                    return date > nowAtMidnight
                  }
                  return false
                }}
                required={required}
              />
            </PopoverContent>
          </Popover>
          {showTime && (
            <Select
              defaultValue={time!}
              onValueChange={(e) => {
                setTime(e)
                if (date) {
                  const [hours, minutes] = e.split(':')
                  const newDate = new Date(date.getTime())
                  newDate.setHours(parseInt(hours), parseInt(minutes))
                  setDate(newDate)
                  handlePickDate(newDate)
                }
              }}
            >
              <SelectTrigger className='font-normal focus:ring-0 w-[100px] rounded-none rounded-r-lg border border-l-0'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className='h-[15rem]'>
                  {Array.from({ length: 96 }).map((_, i) => {
                    const hour = Math.floor(i / 4)
                      .toString()
                      .padStart(2, '0')
                    const minute = ((i % 4) * 15).toString().padStart(2, '0')
                    return (
                      <SelectItem key={i} value={`${hour}:${minute}`}>
                        {hour}:{minute}
                      </SelectItem>
                    )
                  })}
                </ScrollArea>
              </SelectContent>
            </Select>
          )}
        </div>
      </Form>
    )
  }
)

FlexDatePicker.displayName = 'FlexDatePicker'

export { FlexDatePicker }
