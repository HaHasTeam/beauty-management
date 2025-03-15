import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type Row } from '@tanstack/react-table'
import { XIcon } from 'lucide-react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { BsPeople } from 'react-icons/bs'
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
  DrawerClose,
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
import { getFilteredReports, updateReportNote, updateReportStatus } from '@/network/apis/report'
import { IReport, ReportStatusEnum } from '@/types/report'

interface ResolveReportDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  Report: Row<IReport>['original'][]
  showTrigger?: boolean
  onSuccess?: () => void
}

const formSchema = z.object({
  status: z.string({
    message: defaultRequiredRegex.message
  }),
  resultNote: z.string({
    message: defaultRequiredRegex.message
  })
})

export function ResolveReportDialog({ Report, showTrigger = true, onSuccess, ...props }: ResolveReportDialogProps) {
  const queryClient = useQueryClient()
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
      form.setValue('status', report.status)
      form.setValue('resultNote', report.resultNote ?? '')
    }
  }, [Report, form])

  const { mutateAsync: updateReportStatusFn } = useMutation({
    mutationKey: [updateReportStatus.mutationKey],
    mutationFn: updateReportStatus.fn
  })

  const { mutateAsync: updateNoteFn } = useMutation({
    mutationKey: [updateReportNote.mutationKey],
    mutationFn: updateReportNote.fn
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

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant='destructive' size='sm' className='text-white'>
              Action
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <BsPeople className='size-6' aria-hidden='true' />
              Resolve Report
            </DialogTitle>
            <DialogDescription>Consider the report and resolve it carefully.</DialogDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col w-full gap-4' id={formId}>
                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Result Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select a result status' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[ReportStatusEnum.CANCELLED, ReportStatusEnum.DONE].map((status) => (
                            <SelectItem key={status} value={ReportStatusEnum[status as keyof typeof ReportStatusEnum]}>
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
                        <Textarea
                          placeholder='Write your result note here'
                          className='resize-none'
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </DialogHeader>
          <DialogFooter className='gap-2 sm:space-x-0 flex w-full'>
            <DialogClose asChild className='flex-1'>
              <Button variant='outline' disabled={form.formState.isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              className='flex-1'
              loading={form.formState.isSubmitting}
              form={formId}
              type='submit'
              disabled={form.formState.isSubmitting}
            >
              Resolve Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant='destructive' size='sm' className='text-white'>
            <XIcon className='size-4' aria-hidden='true' />
            Ban {Report.length} Selected {Report.length > 1 ? 'Users' : 'User'}
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            You are about to <b className='uppercase'>ban</b>{' '}
            {Report.map((ConsultantService) => (
              <Badge className='mr-1'>{ConsultantService.id}</Badge>
            ))}
            . After banning, the Report will be disabled. Please check the Report before banning.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className='gap-2 sm:space-x-0'>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
          <Button aria-label='Ban Selected rows' className='text-white' variant='destructive'>
            Ban User{Report.length > 1 ? 's' : ''}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
