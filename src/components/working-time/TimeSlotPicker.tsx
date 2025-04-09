import { format } from 'date-fns'
import { CheckSquare, Clock, XSquare } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TimeSlotPickerProps {
  /** Callback function when a time slot is selected */
  onSelectSlot: (date: Date, slotIndex: number) => void
  /** Array of currently selected time slots */
  selectedSlots?: Array<{ date: Date; slotIndex: number }>
  /** Start hour of the day in 24h format (0-23) */
  startTime?: number
  /** End hour of the day in 24h format (1-24) */
  endTime?: number
  /** Duration of each time slot in minutes */
  slotDuration?: number
  /** Array of disabled time slots */
  disabledSlots?: Array<{ date: Date; slotIndex: number }>
  /** Maximum height of the time slot container (with scrolling) */
  maxHeight?: number
  /** Optional callback when multiple slots are selected/deselected at once */
  onBulkSlotChange?: (slots: Array<{ date: Date; slotIndex: number }>, isSelected: boolean) => void
}

// Using theme colors
const weekDayColors = {
  Monday: 'bg-card dark:bg-card border-border text-foreground',
  Tuesday: 'bg-card dark:bg-card border-border text-foreground',
  Wednesday: 'bg-card dark:bg-card border-border text-foreground',
  Thursday: 'bg-card dark:bg-card border-border text-foreground',
  Friday: 'bg-card dark:bg-card border-border text-foreground',
  Saturday: 'bg-card dark:bg-card border-border text-foreground',
  Sunday: 'bg-card dark:bg-card border-border text-foreground'
}

// Updated timeSlotColors to make active slots more visually outstanding
const timeSlotColors = {
  selected: {
    morning:
      'bg-primary/30 hover:bg-primary/40 border-2 border-primary text-primary-foreground shadow-md h-full min-h-12 flex items-center justify-center font-medium scale-105 transform',
    afternoon:
      'bg-primary/30 hover:bg-primary/40 border-2 border-primary text-primary-foreground shadow-md h-full min-h-12 flex items-center justify-center font-medium scale-105 transform',
    evening:
      'bg-primary/30 hover:bg-primary/40 border-2 border-primary text-primary-foreground shadow-md h-full min-h-12 flex items-center justify-center font-medium scale-105 transform'
  },
  unselected: {
    morning:
      'hover:bg-accent/70 hover:border-primary/60 border border-border text-foreground h-full min-h-12 flex items-center justify-center hover:shadow-md transition-all',
    afternoon:
      'hover:bg-accent/70 hover:border-primary/60 border border-border text-foreground h-full min-h-12 flex items-center justify-center hover:shadow-md transition-all',
    evening:
      'hover:bg-accent/70 hover:border-primary/60 border border-border text-foreground h-full min-h-12 flex items-center justify-center hover:shadow-md transition-all'
  },
  // New styles for inactive slots (disabled) - much less visible
  inactive: {
    morning:
      'border border-muted/50 bg-muted/20 text-muted-foreground h-full min-h-12 flex items-center justify-center opacity-30',
    afternoon:
      'border border-muted/50 bg-muted/20 text-muted-foreground h-full min-h-12 flex items-center justify-center opacity-30',
    evening:
      'border border-muted/50 bg-muted/20 text-muted-foreground h-full min-h-12 flex items-center justify-center opacity-30'
  }
}

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function TimeSlotPicker({
  onSelectSlot,
  selectedSlots = [],
  startTime = 0, // 12 AM default
  endTime = 24, // 12 AM next day default (full 24 hours)
  slotDuration = 60, // 1 hour default
  disabledSlots = [],
  maxHeight = 600, // Default max height in pixels
  onBulkSlotChange
}: TimeSlotPickerProps) {
  // Validate time range
  const validStartTime = Math.max(0, Math.min(23, startTime))
  const validEndTime = Math.max(validStartTime + 1, Math.min(24, endTime))

  // Fixed weekdays instead of dynamic dates, to make it reusable
  const weekDays = dayNames.map(
    (day) =>
      new Date(2023, 0, ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(day) + 2)
  )

  // Generate time slots for a specific time
  const generateTimeSlot = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  }

  // Calculate total minutes in the time range
  const totalMinutes = (validEndTime - validStartTime) * 60
  // Calculate number of slots based on time range and slot duration
  const slotsPerDay = Math.ceil(totalMinutes / slotDuration)

  // Generate all time slots
  const timeSlots = Array.from({ length: slotsPerDay }, (_, i) => {
    const totalMinutesFromStart = i * slotDuration
    const hour = validStartTime + Math.floor(totalMinutesFromStart / 60)
    const minute = totalMinutesFromStart % 60
    return generateTimeSlot(hour % 24, minute) // Use modulo to handle hours > 23
  })

  const isSlotSelected = (date: Date, slotIndex: number) => {
    return selectedSlots.some(
      (slot) => format(slot.date, 'EEEE') === format(date, 'EEEE') && slot.slotIndex === slotIndex
    )
  }

  const isSlotDisabled = (date: Date, slotIndex: number) => {
    return disabledSlots.some(
      (disabledSlot) =>
        format(disabledSlot.date, 'EEEE') === format(date, 'EEEE') && disabledSlot.slotIndex === slotIndex
    )
  }

  // Function to check if a time slot should be hidden (all days disabled)
  const shouldHideTimeSlot = (slotIndex: number): boolean => {
    // Check if all days for this time slot are disabled
    return weekDays.every((day) => isSlotDisabled(day, slotIndex))
  }

  // Filter out time slots where all days are disabled
  const visibleTimeSlots = timeSlots.filter((_, slotIndex) => !shouldHideTimeSlot(slotIndex))

  // Helper to get time period (morning, afternoon, evening)
  const getTimePeriod = (hour: number) => {
    if (hour < 12) return 'morning'
    if (hour < 17) return 'afternoon'
    return 'evening'
  }

  // Generate formatted time range string for display
  const getTimeRangeDisplay = (startHour: number, startMinute: number, duration: number) => {
    // Create start time date object
    const startDate = new Date()
    startDate.setHours(startHour, startMinute, 0, 0)

    // Calculate end time
    const endDate = new Date(startDate)
    endDate.setMinutes(endDate.getMinutes() + duration)

    // Format for display
    const startFormatted = format(startDate, 'HH:mm')
    const endFormatted = format(endDate, 'HH:mm')

    return `${startFormatted}-${endFormatted}`
  }

  // Get a compact time range display (for smaller screens)
  const getCompactTimeRangeDisplay = (startHour: number) => {
    return `${startHour.toString().padStart(2, '0')}:00`
  }

  const handleSelectSlot = (date: Date, slotIndex: number) => {
    onSelectSlot(date, slotIndex)
  }

  const handleDayHeaderClick = (day: Date) => {
    const dayOfWeek = format(day, 'EEEE')
    const daySlots = selectedSlots.filter((slot) => format(slot.date, 'EEEE') === dayOfWeek)

    // If there are already slots selected for this day, clear them
    // Otherwise, select all slots for this day
    if (daySlots.length > 0) {
      handleClearDaySlots(day)
    } else {
      handleSelectAllDaySlots(day)
    }
  }

  const handleClearDaySlots = (date: Date) => {
    const slotsToRemove = selectedSlots.filter((slot) => format(slot.date, 'EEEE') === format(date, 'EEEE'))

    if (onBulkSlotChange && slotsToRemove.length > 0) {
      onBulkSlotChange(slotsToRemove, false)
    }
  }

  const handleSelectAllDaySlots = (date: Date) => {
    const dayOfWeek = format(date, 'EEEE')
    const allTimeSlotsForDay: Array<{ date: Date; slotIndex: number }> = []

    timeSlots.forEach((_, slotIndex) => {
      // Check if this slot is already selected or disabled
      const alreadySelected = selectedSlots.some(
        (slot) => format(slot.date, 'EEEE') === dayOfWeek && slot.slotIndex === slotIndex
      )

      const isDisabled = disabledSlots.some(
        (slot) => format(slot.date, 'EEEE') === dayOfWeek && slot.slotIndex === slotIndex
      )

      // Only add if it's not already selected and not disabled
      if (!alreadySelected && !isDisabled) {
        allTimeSlotsForDay.push({ date, slotIndex })
      }
    })

    if (onBulkSlotChange && allTimeSlotsForDay.length > 0) {
      onBulkSlotChange(allTimeSlotsForDay, true)
    }
  }

  const handleClearAll = () => {
    if (onBulkSlotChange && selectedSlots.length > 0) {
      onBulkSlotChange([...selectedSlots], false)
    }
  }

  const handleSelectAll = () => {
    const allPossibleSlots: Array<{ date: Date; slotIndex: number }> = []

    weekDays.forEach((day: Date) => {
      timeSlots.forEach((_, slotIndex) => {
        // Check if this slot is already selected or disabled
        const dayOfWeek = format(day, 'EEEE')
        const alreadySelected = selectedSlots.some(
          (slot) => format(slot.date, 'EEEE') === dayOfWeek && slot.slotIndex === slotIndex
        )

        const isDisabled = disabledSlots.some(
          (slot) => format(slot.date, 'EEEE') === dayOfWeek && slot.slotIndex === slotIndex
        )

        // Only add if it's not already selected and not disabled
        if (!alreadySelected && !isDisabled) {
          allPossibleSlots.push({ date: day, slotIndex })
        }
      })
    })

    if (onBulkSlotChange && allPossibleSlots.length > 0) {
      onBulkSlotChange(allPossibleSlots, true)
    }
  }

  // If there are no visible time slots, show a message
  if (visibleTimeSlots.length === 0) {
    return (
      <div className='flex justify-center items-center py-16 border border-dashed border-muted-foreground/50 rounded-md'>
        <div className='text-center'>
          <Clock className='h-10 w-10 mx-auto mb-3 text-muted-foreground/50' />
          <p className='text-muted-foreground font-medium'>No available time slots found</p>
          <p className='text-sm text-muted-foreground/70 mt-1'>
            Please contact an administrator to set up active time slots
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {/* Action buttons */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2'>
        <div className='text-sm font-medium'>
          {selectedSlots.length > 0 ? (
            <span className='text-primary'>
              You've selected {selectedSlots.length} time slots across{' '}
              {
                // Count unique days that have selections
                new Set(selectedSlots.map((slot) => format(slot.date, 'EEEE'))).size
              }{' '}
              days
            </span>
          ) : (
            <span className='text-muted-foreground'>No time slots selected</span>
          )}
        </div>
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={(e) => {
              e.preventDefault()
              handleSelectAll()
            }}
            type='button'
            className='text-xs'
          >
            <CheckSquare className='mr-1 h-3.5 w-3.5' />
            Select All
          </Button>

          <Button
            variant='outline'
            size='sm'
            onClick={(e) => {
              e.preventDefault()
              handleClearAll()
            }}
            type='button'
            className='text-xs'
            disabled={selectedSlots.length === 0}
          >
            <XSquare className='mr-1 h-3.5 w-3.5' />
            Clear All
          </Button>
        </div>
      </div>

      <div className='overflow-x-auto pb-4'>
        <div className='flex flex-col space-y-2'>
          {/* Day headers with fixed widths to prevent shrinking */}
          <div className='grid grid-cols-8 gap-1 min-w-[700px] md:min-w-[800px]'>
            <div className='py-2 flex items-center justify-center bg-card border border-border rounded-lg shadow-sm'>
              <div className='flex flex-col items-center'>
                <Clock className='h-4 w-4 mb-1 text-primary' />
                <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>Time</span>
              </div>
            </div>
            {weekDays.map((day, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault()
                  handleDayHeaderClick(day)
                }}
                type='button'
                className={cn(
                  'py-2 rounded-lg border shadow-sm flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors w-full min-w-[70px] flex-shrink-0',
                  weekDayColors[dayNames[index] as keyof typeof weekDayColors]
                )}
              >
                <span className='text-sm font-bold text-primary'>{format(day, 'EEE')}</span>
                <span className='text-xs font-medium text-muted-foreground'>{dayNames[index]}</span>
              </button>
            ))}
          </div>

          {/* Time slots grid with max height and scrolling - only showing non-all-disabled slots */}
          <div className='overflow-y-auto' style={{ maxHeight: `${maxHeight}px` }}>
            {visibleTimeSlots.map((timeSlot, visibleIndex) => {
              const hour = parseInt(timeSlot.split(':')[0])
              const minute = parseInt(timeSlot.split(':')[1])
              const period = getTimePeriod(hour)

              // Get original index from the full timeSlots array
              const originalSlotIndex = timeSlots.findIndex((slot) => slot === timeSlot)

              // Create date object for formatting
              const timeDate = new Date()
              timeDate.setHours(hour, minute, 0, 0)

              // Get time range display
              const timeRange = getTimeRangeDisplay(hour, minute, slotDuration)
              const compactTimeRange = getCompactTimeRangeDisplay(hour)

              return (
                <div key={visibleIndex} className='grid grid-cols-8 gap-1 min-h-[60px]'>
                  <div className='flex items-center justify-center py-1.5'>
                    <div className='text-xs whitespace-nowrap font-medium px-2 py-1.5 rounded-md bg-card border border-border shadow-sm text-foreground min-w-[85px] text-center'>
                      <Clock className='h-3 w-3 mr-1 inline-block text-primary' />
                      <span className='hidden sm:inline'>{timeRange}</span>
                      <span className='sm:hidden'>{compactTimeRange}</span>
                    </div>
                  </div>

                  {weekDays.map((day, dayIndex) => {
                    const selected = isSlotSelected(day, originalSlotIndex)
                    const disabled = isSlotDisabled(day, originalSlotIndex)

                    // Apply special styling for active and inactive slots
                    return (
                      <div key={dayIndex} className='flex justify-center items-center p-1'>
                        <button
                          className={cn(
                            'w-full rounded-md transition-all duration-200 text-sm font-medium aspect-square sm:aspect-auto relative',
                            selected
                              ? timeSlotColors.selected[period as keyof typeof timeSlotColors.selected]
                              : disabled
                                ? timeSlotColors.inactive[period as keyof typeof timeSlotColors.inactive]
                                : timeSlotColors.unselected[period as keyof typeof timeSlotColors.unselected],
                            disabled
                              ? 'opacity-40 cursor-not-allowed'
                              : 'hover:shadow-lg transform hover:-translate-y-0.5 hover:scale-105 active:translate-y-0 active:scale-100'
                          )}
                          disabled={disabled}
                          onClick={(e) => {
                            e.preventDefault()
                            handleSelectSlot(day, originalSlotIndex)
                          }}
                          type='button'
                          aria-label={`${dayNames[dayIndex]} ${timeRange} ${disabled ? 'inactive' : 'active'} slot`}
                        >
                          {selected ? (
                            <span className='bg-primary text-primary-foreground rounded-full min-w-6 min-h-6 w-7 h-7 flex items-center justify-center text-xs shadow-sm font-bold'>
                              ✓
                            </span>
                          ) : disabled ? (
                            <span className='w-6 h-6 flex items-center justify-center text-muted'>✕</span>
                          ) : (
                            <span className='w-6 h-6 flex items-center justify-center'>—</span>
                          )}

                          {/* Status indicator for active vs inactive slots */}
                          {!disabled && !selected && (
                            <span className='absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Legend for slot status */}
      <div className='flex flex-wrap gap-4 mt-3 text-xs'>
        <div className='flex items-center'>
          <div className='w-3.5 h-3.5 mr-1.5 border-2 border-primary bg-primary/30 rounded'></div>
          <span>Selected slots</span>
        </div>
        <div className='flex items-center'>
          <div className='w-3.5 h-3.5 mr-1.5 border border-border bg-transparent rounded relative'>
            <span className='absolute -top-1 -right-1 w-1.5 h-1.5 bg-green-500 rounded-full'></span>
          </div>
          <span>Available slots</span>
        </div>
        <div className='flex items-center'>
          <div className='w-3.5 h-3.5 mr-1.5 border border-muted/50 bg-muted/20 rounded opacity-40'></div>
          <span>Inactive slots</span>
        </div>
      </div>

      {/* Help text for better understanding */}
      <div className='mt-2 p-2.5 bg-muted/20 rounded-md text-xs text-muted-foreground'>
        <p className='flex items-center'>
          <span className='mr-2'>💡</span>
          <span>
            <strong>Only time slots with at least one active day</strong> are shown. Hidden time slots are completely
            inactive.
          </span>
        </p>
      </div>
    </div>
  )
}
