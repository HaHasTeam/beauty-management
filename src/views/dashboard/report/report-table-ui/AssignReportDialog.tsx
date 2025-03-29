import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type Row } from '@tanstack/react-table'
import { XIcon } from 'lucide-react'
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
  DrawerClose,
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
import { assignReport, getFilteredReports, updateReportStatus } from '@/network/apis/report'
import { useStore } from '@/stores/store'
import { IReport, ReportStatusEnum } from '@/types/report'
import { UserRoleEnum } from '@/types/role'
import { UserStatusEnum } from '@/types/user'

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
              Assign report to your team member
            </DialogTitle>
            <DialogDescription>
              Try to assign the selected report to your team member who have to take action on it.
            </DialogDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col w-full gap-4' id={formId}>
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
                            role: UserRoleEnum.CONSULTANT,
                            status: UserStatusEnum.ACTIVE
                          }}
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
              Assign now
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
