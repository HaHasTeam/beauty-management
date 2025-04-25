import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type Row } from '@tanstack/react-table'
import { CheckSquare, InfoIcon } from 'lucide-react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import Button from '@/components/button'
import FormLabel from '@/components/form-label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { defaultRequiredRegex } from '@/constants/regex'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useToast } from '@/hooks/useToast'
import { filterReports, getFilteredReports, updateReportNote, updateReportStatus } from '@/network/apis/report'
import { IReport, ReportStatusEnum } from '@/types/report'

// Map for display purposes
const REPORT_TYPE_MAP = {
  ORDER: 'Order',
  TRANSACTION: 'Transaction',
  BOOKING: 'Booking',
  SYSTEM_FEATURE: 'System Feature',
  OTHER: 'Other'
}

interface ResolveReportDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  Report: Row<IReport>['original'][]
  showTrigger?: boolean
  onSuccess?: () => void
}

const formSchema = z.object({
  status: z.string({
    message: defaultRequiredRegex.message()
  }),
  resultNote: z.string({
    message: defaultRequiredRegex.message()
  })
})

export function ResolveReportDialog({ Report, showTrigger = true, onSuccess, ...props }: ResolveReportDialogProps) {
  const formId = React.useId()
  const { successToast } = useToast()

  const handleServerErrors = useHandleServerError()
  const isDesktop = useMediaQuery('(min-width: 640px)')
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: '',
      resultNote: ''
    }
  })

  React.useEffect(() => {
    const report = Report?.[0]
    if (report) {
      // Ensure status is set only if it exists and is valid for resolution
      if (report.status && [ReportStatusEnum.CANCELLED, ReportStatusEnum.APPROVED].includes(report.status)) {
        form.setValue('status', report.status)
      } else {
        // Optionally set a default or leave blank if current status is not a final one
        form.setValue('status', '')
      }
      form.setValue('resultNote', report.resultNote ?? '')
    }
  }, [Report, form])

  const { mutateAsync: updateReportStatusFn } = useMutation({
    mutationKey: [updateReportStatus.mutationKey],
    mutationFn: updateReportStatus.fn
  })

  const queryClient = useQueryClient()
  const { mutateAsync: updateNoteFn } = useMutation({
    mutationKey: [updateReportNote.mutationKey],
    mutationFn: updateReportNote.fn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [filterReports.queryKey]
      })
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateReportStatusFn({
        id: Report[0].id,
        status: values.status as ReportStatusEnum
      })
      await updateNoteFn({
        id: Report[0].id,
        resultNote: values.resultNote
      })
      successToast({
        message: 'Report resolved successfully'
      })
      queryClient.invalidateQueries({
        queryKey: [getFilteredReports.queryKey]
      })
      props.onOpenChange?.(false)
      onSuccess?.()
    } catch (error) {
      handleServerErrors({
        error
      })
    }
  }

  // Define common content for Dialog and Drawer
  const content = (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)} id={formId} className='flex flex-col w-full gap-4'>
        <div className='py-4'>
          {/* Display selected reports */}
          <div className='flex flex-wrap gap-1 mb-4'>
            {Report.map((report) => (
              <Badge key={report.id} variant='outline' className='bg-slate-100'>
                Report #{report.id.substring(0, 8)} ({REPORT_TYPE_MAP[report.type] || 'N/A'})
              </Badge>
            ))}
          </div>

          {/* Informational Block */}
          <div className='rounded-md bg-blue-50 p-4 mb-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <InfoIcon className='h-5 w-5 text-blue-400' aria-hidden='true' />
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-blue-800'>Resolving this report</h3>
                <div className='mt-2 text-sm text-blue-700'>
                  <p>Please review the details carefully and provide a resolution status and note:</p>
                  <ul className='list-disc pl-5 space-y-1 mt-2'>
                    <li>Select the final status (e.g., Approved, Rejected).</li>
                    <li>Provide a clear note explaining the resolution.</li>
                    <li>This action is final and will update the report record.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem className='mb-4'>
                <FormLabel required>Result Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a result status' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[ReportStatusEnum.APPROVED, ReportStatusEnum.REJECTED].map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='resultNote'
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Result Note</FormLabel>
                <FormControl>
                  <Textarea placeholder='Write your result note here...' className='resize-none' rows={6} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )

  // Define common footer for Dialog and Drawer
  const footer = (
    <>
      <DialogClose asChild>
        <Button variant='outline' disabled={form.formState.isSubmitting}>
          Cancel
        </Button>
      </DialogClose>
      <Button
        variant='default' // Changed variant
        loading={form.formState.isSubmitting}
        form={formId}
        type='submit'
        disabled={form.formState.isSubmitting}
      >
        Resolve Report
      </Button>
    </>
  )

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            {/* Updated Trigger Button */}
            <Button variant='default' size='sm' className='gap-1'>
              <CheckSquare className='size-4' aria-hidden='true' />
              <span>Resolve Report{Report.length > 1 ? 's' : ''}</span>
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              {/* Updated Icon */}
              <CheckSquare className='size-6' aria-hidden='true' />
              Resolve Report
            </DialogTitle>
            <DialogDescription>Consider the report and resolve it carefully.</DialogDescription>
          </DialogHeader>
          {/* Use common content */}
          {content}
          {/* Use common footer */}
          <DialogFooter className='gap-2 sm:justify-end'>{footer}</DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          {/* Updated Trigger Button */}
          <Button variant='default' size='sm' className='gap-1'>
            <CheckSquare className='size-4' aria-hidden='true' />
            <span>Resolve Report{Report.length > 1 ? 's' : ''}</span>
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle className='flex items-center gap-2'>
            {/* Updated Icon */}
            <CheckSquare className='size-6' aria-hidden='true' />
            Resolve Report
          </DrawerTitle>
          <DrawerDescription>Consider the report and resolve it carefully.</DrawerDescription>
        </DrawerHeader>
        {/* Use common content with padding */}
        <div className='px-4'>{content}</div>
        {/* Use common footer */}
        <DrawerFooter className='pt-2 gap-2'>{footer}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
