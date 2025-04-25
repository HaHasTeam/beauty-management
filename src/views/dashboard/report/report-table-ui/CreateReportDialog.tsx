'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'
import { Book, CameraIcon, FileText, MessageCircle, Package, ShoppingBag, Video } from 'lucide-react'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import Button from '@/components/button'
import UploadFiles, { TriggerUploadRef } from '@/components/file-input/UploadFiles'
import FormLabel from '@/components/form-label'
import SelectBooking from '@/components/select-booking'
import SelectOrder from '@/components/select-order'
import SelectTransaction from '@/components/select-transaction'
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { createReport, filterReports } from '@/network/apis/report'
import { TCreateReportRequestParams } from '@/network/apis/report/type'
import { TFile } from '@/types/file'
import { ReportTypeEnum } from '@/types/report'

// Define predefined reasons for each report type
const predefinedReasons = {
  [ReportTypeEnum.ORDER]: [
    { id: 'wrong_order', label: 'Wrong order details' },
    { id: 'payment_issue', label: 'Payment issue' },
    { id: 'delivery_delay', label: 'Delivery delay' },
    { id: 'quality_issue', label: 'Quality issue with product' },
    { id: 'other', label: 'Other (specify)' }
  ],
  [ReportTypeEnum.TRANSACTION]: [
    { id: 'payment_failed', label: 'Payment failed' },
    { id: 'double_charge', label: 'Double charge' },
    { id: 'refund_issue', label: 'Refund issue' },
    { id: 'incorrect_amount', label: 'Incorrect amount charged' },
    { id: 'other', label: 'Other (specify)' }
  ],
  [ReportTypeEnum.BOOKING]: [
    { id: 'scheduling_conflict', label: 'Scheduling conflict' },
    { id: 'cancellation_issue', label: 'Cancellation issue' },
    { id: 'consultant_unavailable', label: 'Consultant unavailable' },
    { id: 'technical_issue', label: 'Technical issue during booking' },
    { id: 'other', label: 'Other (specify)' }
  ],
  [ReportTypeEnum.SYSTEM_FEATURE]: [
    { id: 'feature_not_working', label: 'Feature not working' },
    { id: 'ui_issue', label: 'UI/UX issue' },
    { id: 'performance_issue', label: 'Performance issue' },
    { id: 'missing_functionality', label: 'Missing functionality' },
    { id: 'other', label: 'Other (specify)' }
  ],
  [ReportTypeEnum.OTHER]: [
    { id: 'account_issue', label: 'Account issue' },
    { id: 'suggestion', label: 'Suggestion' },
    { id: 'general_feedback', label: 'General feedback' },
    { id: 'other', label: 'Other (specify)' }
  ]
}

// Define form schema for report creation
const reportFormSchema = z
  .object({
    reasonType: z.string().min(1, 'Please select a reason'),
    customReason: z.string().optional(),
    reason: z.string().optional(),
    type: z.nativeEnum(ReportTypeEnum),
    orderId: z.string().optional(),
    bookingId: z.string().optional(),
    transactionId: z.string().optional(),
    files: z.array(z.unknown()).min(1, 'At least one file is required'),
    // Hidden fields to store object references
    _orderObject: z.any().optional(),
    _bookingObject: z.any().optional(),
    _transactionObject: z.any().optional()
  })
  .refine(
    (data) => {
      // Only require reason if reasonType is 'other'
      if (data.reasonType === 'other') {
        return !!data.reason && data.reason.trim().length > 0
      }
      return true
    },
    {
      message: 'Please describe your issue',
      path: ['reason']
    }
  )

type ReportFormValues = z.infer<typeof reportFormSchema>

interface ReportTypeCardProps {
  type: ReportTypeEnum
  title: string
  description: string
  icon: React.ReactNode
  selected: boolean
  onClick: () => void
}

const ReportTypeCard = ({ type, title, description, icon, selected, onClick }: ReportTypeCardProps) => {
  // Color mapping for different report types
  const typeColors = {
    [ReportTypeEnum.ORDER]:
      'from-blue-500/10 to-blue-600/10 border-blue-500/20 hover:border-blue-500 [&_svg]:text-white [&_.icon-bg]:bg-blue-500',
    [ReportTypeEnum.TRANSACTION]:
      'from-green-500/10 to-green-600/10 border-green-500/20 hover:border-green-500 [&_svg]:text-white [&_.icon-bg]:bg-green-500',
    [ReportTypeEnum.BOOKING]:
      'from-purple-500/10 to-purple-600/10 border-purple-500/20 hover:border-purple-500 [&_svg]:text-white [&_.icon-bg]:bg-purple-500',
    [ReportTypeEnum.SYSTEM_FEATURE]:
      'from-amber-500/10 to-amber-600/10 border-amber-500/20 hover:border-amber-500 [&_svg]:text-white [&_.icon-bg]:bg-amber-500',
    [ReportTypeEnum.OTHER]:
      'from-gray-500/10 to-gray-600/10 border-gray-500/20 hover:border-gray-500 [&_svg]:text-white [&_.icon-bg]:bg-gray-500'
  }

  return (
    <div
      className={cn(
        'relative p-4 border rounded-lg cursor-pointer transition-all duration-200',
        'bg-gradient-to-br shadow-sm hover:shadow-md',
        'transform hover:-translate-y-0.5',
        typeColors[type],
        selected
          ? ['ring-1 ring-green-500 shadow-md', 'border-green-500/30 bg-green-50 dark:bg-green-950/20']
          : 'border-border/30'
      )}
      onClick={onClick}
      data-type={type}
    >
      <div className='flex items-start gap-3'>
        <div className='icon-bg flex-shrink-0 rounded-full w-10 h-10 flex items-center justify-center shadow-sm'>
          {icon}
        </div>
        <div>
          <h3 className='text-base font-medium text-foreground'>{title}</h3>
          <p className='text-xs text-muted-foreground'>{description}</p>
        </div>
      </div>
      {selected && (
        <div className='absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='12'
            height='12'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='3'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <polyline points='20 6 9 17 4 12'></polyline>
          </svg>
        </div>
      )}
    </div>
  )
}

interface CreateReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateReportDialog({ open, onOpenChange, onSuccess }: CreateReportDialogProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedType, setSelectedType] = useState<ReportTypeEnum | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const fileUploadRef = useRef<TriggerUploadRef>({ triggers: [] })

  const reportTypesInfo = {
    [ReportTypeEnum.ORDER]: {
      title: 'Order Report',
      description: 'Report issues related to orders',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='m7.5 4.27 9 5.15' />
          <path d='M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z' />
          <path d='m3.3 7 8.7 5 8.7-5' />
          <path d='M12 12v9' />
        </svg>
      )
    },
    [ReportTypeEnum.TRANSACTION]: {
      title: 'Transaction Report',
      description: 'Report issues with financial transactions',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <rect width='20' height='14' x='2' y='5' rx='2' />
          <path d='M16 14V8' />
          <path d='M12 14V8' />
          <path d='M8 14v-3' />
        </svg>
      )
    },
    [ReportTypeEnum.BOOKING]: {
      title: 'Booking Report',
      description: 'Report issues with appointments or bookings',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <rect width='18' height='18' x='3' y='4' rx='2' ry='2' />
          <line x1='16' x2='16' y1='2' y2='6' />
          <line x1='8' x2='8' y1='2' y2='6' />
          <line x1='3' x2='21' y1='10' y2='10' />
          <path d='M8 14h.01' />
          <path d='M12 14h.01' />
          <path d='M16 14h.01' />
          <path d='M8 18h.01' />
          <path d='M12 18h.01' />
          <path d='M16 18h.01' />
        </svg>
      )
    },
    [ReportTypeEnum.SYSTEM_FEATURE]: {
      title: 'System Feature Report',
      description: 'Report issues with system features or functionality',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <circle cx='12' cy='12' r='10' />
          <line x1='2' x2='22' y1='12' y2='12' />
          <path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' />
        </svg>
      )
    },
    [ReportTypeEnum.OTHER]: {
      title: 'Other Report',
      description: 'Report any other issues not covered by other categories',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z' />
        </svg>
      )
    }
  }

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      reasonType: '',
      customReason: '',
      reason: '',
      type: selectedType || ReportTypeEnum.OTHER,
      files: [],
      orderId: '',
      bookingId: '',
      transactionId: '',
      _orderObject: null,
      _bookingObject: null,
      _transactionObject: null
    }
  })

  const queryClient = useQueryClient()
  const { mutate: submitReport } = useMutation({
    mutationFn: createReport.fn,
    onSuccess: () => {
      toast.success('Report created successfully')
      resetForm()
      onSuccess?.()
      onOpenChange(false)
      queryClient.invalidateQueries({ queryKey: [filterReports.queryKey] })
    },
    onError: (error: Error) => {
      toast.error(`Failed to create report: ${error.message || 'Unknown error'}`)
    }
  })

  const resetForm = () => {
    setStep(1)
    setSelectedType(null)
    form.reset()
  }

  const resetAndClose = () => {
    resetForm()
    onOpenChange(false)
  }

  const handleSelectType = (type: ReportTypeEnum) => {
    setSelectedType(type)
    form.setValue('type', type)
    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
  }

  const onSubmit = async () => {
    try {
      // Upload files first if there are any pending
      if (fileUploadRef.current?.triggers.length) {
        for (const trigger of fileUploadRef.current.triggers) {
          await trigger()
        }
      }

      // Get latest values after file uploads

      // Get latest values after file uploads
      const latestValues = form.getValues()

      // Ensure reason always has a value
      const reasonValue: string =
        latestValues.reasonType === 'other'
          ? latestValues.reason || '' // Add fallback to empty string
          : (selectedType && predefinedReasons[selectedType].find((r) => r.id === latestValues.reasonType)?.label) || ''

      // Create API-compatible payload with proper types
      const apiPayload = {
        reason: reasonValue,
        type: latestValues.type,
        files: (latestValues.files as TFile[]).map((file: TFile) => file.fileUrl),
        orderId: latestValues.orderId,
        bookingId: latestValues.bookingId,
        transactionId: latestValues.transactionId
      }

      const cleanPayload = _.omitBy(apiPayload, (value) => !value)

      submitReport(cleanPayload as TCreateReportRequestParams)
    } catch (error) {
      toast.error('Error submitting report: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  // Kiểm tra xem có cần hiển thị chi tiết cho loại báo cáo đã chọn không
  const shouldShowDetailsSection = () => {
    if (!selectedType) return false
    return [ReportTypeEnum.ORDER, ReportTypeEnum.BOOKING, ReportTypeEnum.TRANSACTION].includes(selectedType)
  }

  // Cập nhật reason khi reasonType thay đổi
  const handleReasonTypeChange = (value: string) => {
    form.setValue('reasonType', value)

    // Nếu không phải 'other', tự động cập nhật reason dựa trên label
    if (value !== 'other' && selectedType) {
      const reasonLabel = predefinedReasons[selectedType].find((r) => r.id === value)?.label || ''
      form.setValue('reason', reasonLabel)
    }
  }

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className='sm:max-w-[700px] lg:max-w-[800px] max-h-[85vh] flex flex-col p-0 overflow-hidden gap-0 rounded-lg border shadow-md'>
        <div className='px-4 py-3 border-b bg-gradient-to-r from-primary/15 to-transparent'>
          <h2 className='text-lg font-semibold text-foreground flex items-center gap-2'>
            {step === 1 ? (
              <>
                <div className='p-1.5 rounded-full bg-primary/25 text-primary shadow-sm'>
                  <MessageCircle className='h-4.5 w-4.5' />
                </div>
                <span className='tracking-tight'>New Issue Report</span>
              </>
            ) : (
              <>
                <div className='p-1.5 rounded-full shadow-sm bg-primary/25'>
                  {selectedType === ReportTypeEnum.ORDER && <ShoppingBag className='h-4.5 w-4.5 text-primary' />}
                  {selectedType === ReportTypeEnum.TRANSACTION && <FileText className='h-4.5 w-4.5 text-primary' />}
                  {selectedType === ReportTypeEnum.BOOKING && <Video className='h-4.5 w-4.5 text-primary' />}
                  {selectedType === ReportTypeEnum.SYSTEM_FEATURE && <Package className='h-4.5 w-4.5 text-primary' />}
                  {selectedType === ReportTypeEnum.OTHER && <Book className='h-4.5 w-4.5 text-primary' />}
                </div>
                <span className='font-semibold tracking-tight'>
                  {selectedType === ReportTypeEnum.ORDER && 'Order Issue Report'}
                  {selectedType === ReportTypeEnum.TRANSACTION && 'Payment Issue Report'}
                  {selectedType === ReportTypeEnum.BOOKING && 'Booking Issue Report'}
                  {selectedType === ReportTypeEnum.SYSTEM_FEATURE && 'System Issue Report'}
                  {selectedType === ReportTypeEnum.OTHER && 'General Issue Report'}
                </span>
              </>
            )}
          </h2>
        </div>
        <ScrollArea className='flex-1 overflow-y-auto max-h-[72vh]'>
          {step === 1 ? (
            <div className='p-4'>
              <p className='text-sm text-muted-foreground mb-3'>Please select the type of issue you'd like to report</p>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                {Object.entries(reportTypesInfo).map(([type, info]) => (
                  <ReportTypeCard
                    key={type}
                    type={type as ReportTypeEnum}
                    title={info.title}
                    description={info.description}
                    icon={info.icon}
                    selected={selectedType === type}
                    onClick={() => handleSelectType(type as ReportTypeEnum)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className='p-4'>
                <div className='space-y-4'>
                  {/* Main Grid Layout - Responsive: 1 column or 2 columns depending on if details are needed */}
                  <div
                    className={cn(
                      'grid gap-4 items-start',
                      shouldShowDetailsSection() ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
                    )}
                  >
                    {/* Left Column - Reason */}
                    <div className='space-y-3 bg-card rounded-lg p-3.5 border shadow-sm'>
                      <div className='flex items-center gap-2 mb-2'>
                        <div className='bg-primary/25 p-1.5 rounded-full'>
                          <MessageCircle className='h-3.5 w-3.5 text-primary' />
                        </div>
                        <h3 className='font-medium text-sm text-foreground'>
                          <span className='tracking-tight'>Issue Description</span>
                        </h3>
                      </div>

                      <FormField
                        control={form.control}
                        name='reasonType'
                        render={({ field }) => (
                          <FormItem className='space-y-2'>
                            <FormControl>
                              <RadioGroup
                                onValueChange={(value) => handleReasonTypeChange(value)}
                                defaultValue={field.value}
                                className='space-y-1 border rounded-md py-2 px-2.5 bg-background'
                              >
                                {selectedType &&
                                  predefinedReasons[selectedType].map((reason) => {
                                    const radioId = `reason-${reason.id}`
                                    return (
                                      <div
                                        key={reason.id}
                                        className='rounded-md hover:bg-muted/40 transition-all'
                                        onClick={() => handleReasonTypeChange(reason.id)}
                                      >
                                        <FormItem className='flex items-center space-x-2.5 space-y-0 p-1.5 cursor-pointer'>
                                          <FormControl>
                                            <RadioGroupItem value={reason.id} id={radioId} className='cursor-pointer' />
                                          </FormControl>
                                          <FormLabel
                                            htmlFor={radioId}
                                            className='font-normal text-sm text-foreground cursor-pointer m-0 w-full'
                                          >
                                            {reason.label}
                                          </FormLabel>
                                        </FormItem>
                                      </div>
                                    )
                                  })}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {form.watch('reasonType') === 'other' && (
                        <FormField
                          control={form.control}
                          name='reason'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-xs font-medium text-muted-foreground'>
                                Please describe your issue
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder='Describe the issue in detail'
                                  className='min-h-[100px] resize-none focus:ring-primary focus:border-primary transition-all text-sm'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    {/* Right Column - Entity Details - Only show if needed */}
                    {shouldShowDetailsSection() && (
                      <div className='space-y-3 bg-card rounded-lg p-3.5 border shadow-sm'>
                        <div className='flex items-center gap-2 mb-2'>
                          <div className='bg-primary/25 p-1.5 rounded-full'>
                            {selectedType === ReportTypeEnum.ORDER && (
                              <ShoppingBag className='h-3.5 w-3.5 text-primary' />
                            )}
                            {selectedType === ReportTypeEnum.TRANSACTION && (
                              <FileText className='h-3.5 w-3.5 text-primary' />
                            )}
                            {selectedType === ReportTypeEnum.BOOKING && <Video className='h-3.5 w-3.5 text-primary' />}
                          </div>
                          <h3 className='font-medium text-sm text-foreground tracking-tight'>
                            {selectedType === ReportTypeEnum.ORDER && 'Select Affected Order'}
                            {selectedType === ReportTypeEnum.TRANSACTION && 'Specify Transaction'}
                            {selectedType === ReportTypeEnum.BOOKING && 'Select Affected Booking'}
                          </h3>
                        </div>

                        {/* Order Details */}
                        {selectedType === ReportTypeEnum.ORDER && (
                          <FormField
                            control={form.control}
                            name='_orderObject'
                            render={({ field }) => (
                              <FormItem className='space-y-1.5'>
                                <FormLabel required className='text-xs font-medium'>
                                  Order Reference
                                </FormLabel>
                                <FormControl>
                                  <SelectOrder
                                    value={field.value}
                                    onChange={(order) => {
                                      field.onChange(order)
                                      // Update the string ID field for API submission
                                      if (order && 'id' in order) {
                                        form.setValue('orderId', order.id || '')
                                      } else {
                                        form.setValue('orderId', '')
                                      }
                                    }}
                                    placeholder='Search for an order...'
                                    className='bg-background border focus-within:ring-primary rounded-md shadow-sm text-sm'
                                  />
                                </FormControl>
                                <FormMessage />
                                <p className='text-xs text-muted-foreground mt-1'>
                                  Select the order related to this issue
                                </p>
                              </FormItem>
                            )}
                          />
                        )}

                        {/* Booking Details */}
                        {selectedType === ReportTypeEnum.BOOKING && (
                          <FormField
                            control={form.control}
                            name='_bookingObject'
                            render={({ field }) => (
                              <FormItem className='space-y-1.5'>
                                <FormLabel required className='text-xs font-medium'>
                                  Booking Reference
                                </FormLabel>
                                <FormControl>
                                  <SelectBooking
                                    value={field.value}
                                    onChange={(booking) => {
                                      field.onChange(booking)
                                      // Update the string ID field for API submission
                                      if (booking && 'id' in booking) {
                                        form.setValue('bookingId', booking.id || '')
                                      } else {
                                        form.setValue('bookingId', '')
                                      }
                                    }}
                                    placeholder='Search for a booking...'
                                    className='bg-background border focus-within:ring-primary rounded-md shadow-sm text-sm'
                                  />
                                </FormControl>
                                <FormMessage />
                                <p className='text-xs text-muted-foreground mt-1'>
                                  Select the booking related to this issue
                                </p>
                              </FormItem>
                            )}
                          />
                        )}

                        {/* Transaction Details */}
                        {selectedType === ReportTypeEnum.TRANSACTION && (
                          <FormField
                            control={form.control}
                            name='_transactionObject'
                            render={({ field }) => (
                              <FormItem className='space-y-1.5'>
                                <FormLabel required className='text-xs font-medium'>
                                  Transaction Reference
                                </FormLabel>
                                <FormControl>
                                  <SelectTransaction
                                    value={field.value}
                                    onChange={(transaction) => {
                                      field.onChange(transaction)
                                      // Update the string ID field for API submission
                                      if (transaction && 'id' in transaction) {
                                        form.setValue('transactionId', transaction.id || '')
                                      } else {
                                        form.setValue('transactionId', '')
                                      }
                                    }}
                                    placeholder='Search for a transaction...'
                                    className='bg-background border focus-within:ring-primary rounded-md shadow-sm text-sm'
                                  />
                                </FormControl>
                                <FormMessage />
                                <p className='text-xs text-muted-foreground mt-1'>
                                  Select the transaction related to this issue
                                </p>
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* File Upload Section */}
                  <div className='bg-card rounded-lg p-3.5 border shadow-sm space-y-3'>
                    <div className='flex items-center gap-2 mb-1.5'>
                      <div className='bg-primary/25 p-1.5 rounded-full'>
                        <CameraIcon className='h-3.5 w-3.5 text-primary' />
                      </div>
                      <h3 className='font-medium text-sm text-foreground tracking-tight'>Evidence & Attachments</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name='files'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <UploadFiles
                              triggerRef={fileUploadRef}
                              field={{
                                ...field,
                                value: field.value as TFile[]
                              }}
                              isAcceptImage={true}
                              isAcceptFile={true}
                              maxImages={5}
                              dropZoneConfigOptions={{
                                maxFiles: 5,
                                accept: {
                                  'image/*': ['.jpg', '.jpeg', '.png'],
                                  'application/pdf': ['.pdf']
                                }
                              }}
                              header={
                                <p className='text-xs font-medium text-muted-foreground mb-1.5'>
                                  Upload screenshots or documents that help explain the issue (at least one required)
                                </p>
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </form>
            </Form>
          )}
        </ScrollArea>
        {step === 2 && (
          <DialogFooter className='px-4 py-3 border-t justify-between sm:justify-between bg-muted/5'>
            <Button
              type='button'
              variant='outline'
              onClick={handleBack}
              className='shadow-sm text-sm h-9'
              disabled={form.formState.isSubmitting}
              loading={form.formState.isSubmitting}
            >
              Back
            </Button>
            <Button
              type='submit'
              disabled={form.formState.isSubmitting}
              onClick={() => formRef.current?.requestSubmit()}
              className='gap-2 shadow-sm h-9 text-sm font-medium'
              loading={form.formState.isSubmitting}
            >
              Submit Report
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
