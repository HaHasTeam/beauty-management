import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type Row } from '@tanstack/react-table'
import { InfoIcon } from 'lucide-react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { BsPeople } from 'react-icons/bs'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import Button from '@/components/button'
import FormLabel from '@/components/form-label'
import SelectUser from '@/components/select-user'
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
import { defaultRequiredRegex } from '@/constants/regex'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useToast } from '@/hooks/useToast'
import { assignReport, filterReports, updateReportStatus } from '@/network/apis/report'
import { useStore } from '@/stores/store'
import { IReport, ReportStatusEnum } from '@/types/report'
import { UserRoleEnum } from '@/types/role'
import { UserStatusEnum } from '@/types/user'

const REPORT_TYPE_MAP = {
  ORDER: 'Order',
  TRANSACTION: 'Transaction',
  BOOKING: 'Booking',
  SYSTEM_FEATURE: 'System Feature',
  OTHER: 'Other'
}

interface AssignReportDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  Report: Row<IReport>['original'][]
  showTrigger?: boolean
  onSuccess?: () => void
}

const formSchema = z.object({
  assigneeId: z.string({
    message: defaultRequiredRegex.message()
  })
})

export function AssignReportDialog({ Report, showTrigger = true, onSuccess, ...props }: AssignReportDialogProps) {
  const queryClient = useQueryClient()
  const formId = React.useId()
  const { successToast } = useToast()
  const { userData } = useStore(
    useShallow((state) => {
      return {
        userData: state.user
      }
    })
  )

  const { mutateAsync: updateReportStatusFn } = useMutation({
    mutationKey: [updateReportStatus.mutationKey],
    mutationFn: updateReportStatus.fn
  })

  const handleServerErrors = useHandleServerError()
  const isDesktop = useMediaQuery('(min-width: 640px)')
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assigneeId: userData?.id
    }
  })

  const { mutateAsync: assignFn } = useMutation({
    mutationKey: [assignReport.mutationKey],
    mutationFn: assignReport.fn,
    onSuccess: () => {
      successToast({
        message: 'Report assigned successfully'
      })
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await assignFn({
        id: Report[0].id,
        assigneeId: values.assigneeId
      })
      await updateReportStatusFn({
        id: Report[0].id,
        status: ReportStatusEnum.IN_PROCESSING
      })

      form.reset({
        assigneeId: userData?.id
      })
      queryClient.invalidateQueries({
        queryKey: [filterReports.queryKey]
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
        {/* Display selected reports */}
        <div className='py-4'>
          <div className='flex flex-wrap gap-1 mb-4'>
            {Report.map((report) => (
              <Badge key={report.id} variant='outline' className='bg-slate-100'>
                Report #{report.id.substring(0, 8)} ({REPORT_TYPE_MAP[report.type]})
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
                <h3 className='text-sm font-medium text-blue-800'>What happens next?</h3>
                <div className='mt-2 text-sm text-blue-700'>
                  <p>Assigning this report means:</p>
                  <ul className='list-disc pl-5 space-y-1 mt-2'>
                    <li>The selected team member will be notified and responsible for handling it.</li>
                    <li>The report status will change to {ReportStatusEnum.IN_PROCESSING}.</li>
                    <li>You can track the progress in the report list.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Assignee Selection */}
          <FormField
            control={form.control}
            name='assigneeId'
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Team Members</FormLabel>
                <FormControl>
                  <SelectUser
                    {...field}
                    includeSelf
                    placeholder='Select a member to assign'
                    query={{
                      role: UserRoleEnum.OPERATOR,
                      status: UserStatusEnum.ACTIVE
                    }}
                  />
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
        variant='default'
        loading={form.formState.isSubmitting}
        form={formId}
        type='submit'
        disabled={form.formState.isSubmitting}
      >
        Assign now
      </Button>
    </>
  )

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            {/* Updated Button Text */}
            <Button variant='default' size='sm' className='gap-1'>
              <BsPeople className='size-4' aria-hidden='true' />
              <span>Assign Report{Report.length > 1 ? 's' : ''}</span>
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <BsPeople className='size-6' aria-hidden='true' />
              Assign report to your team member
            </DialogTitle>
            <DialogDescription>
              Assign the selected report{Report.length > 1 ? 's' : ''} to a team member who will take action.
            </DialogDescription>
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
          {/* Updated Button Text and Icon */}
          <Button variant='default' size='sm' className='gap-1'>
            <BsPeople className='size-4' aria-hidden='true' />
            <span>Assign Report{Report.length > 1 ? 's' : ''}</span>
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle className='flex items-center gap-2'>
            <BsPeople className='size-6' aria-hidden='true' />
            Assign report to your team member
          </DrawerTitle>
          <DrawerDescription>
            Assign the selected report{Report.length > 1 ? 's' : ''} to a team member who will take action.
          </DrawerDescription>
        </DrawerHeader>
        {/* Use common content with padding */}
        <div className='px-4'>{content}</div>
        {/* Use common footer, adjusted for Drawer */}
        <DrawerFooter className='pt-2 gap-2'>{footer}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
