import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { forwardRef, useEffect, useState } from 'react'
import { ControllerFieldState, FieldValues, UseFormReturn } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { FormControl } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import { Calendar } from '../ui/calendar'

type Props<TFieldValues extends FieldValues> = {
  field: React.InputHTMLAttributes<HTMLInputElement>
  formState?: UseFormReturn<TFieldValues>
  fieldState?: ControllerFieldState
  onlyFutureDates?: boolean
  onlyPastDates?: boolean
}
// eslint-disable-next-line
const FlexDatePicker = forwardRef<HTMLButtonElement, Props<any>>(({ field, onlyFutureDates, onlyPastDates }, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(field.value ? new Date(field.value as string) : undefined)

  const handlePickDate = (selectedDate: Date) => {
    setDate(selectedDate)
    if (field.onChange) field.onChange(selectedDate.toString() as unknown as React.ChangeEvent<HTMLInputElement>)
  }

  useEffect(() => {
    if (field.value) setDate(new Date(field.value as string))
  }, [field.value])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={'outline'}
            className={cn('w-full font-normal bg-transparent', !field.value && 'text-muted-foreground')}
            ref={ref}
          >
            {field.value ? `${format(field.value as string, 'PPP')}` : <span>Select a date</span>}
            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          captionLayout='dropdown'
          disabled={(date) => {
            if (onlyFutureDates) {
              return date < new Date()
            }
            if (onlyPastDates) {
              return date > new Date()
            }
            return false
          }}
          selected={date as Date}
          onSelect={(date) => handlePickDate(date as Date)}
          onDayClick={() => setIsOpen(false)}
          fromYear={1950}
          toYear={new Date().getFullYear() + 100}
          defaultMonth={date as Date}
        />
      </PopoverContent>
    </Popover>
  )
})

FlexDatePicker.displayName = 'FlexDatePicker'

export { FlexDatePicker }
