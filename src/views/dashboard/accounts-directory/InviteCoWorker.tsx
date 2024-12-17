import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { UploadIcon, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { PiMicrosoftExcelLogoBold } from 'react-icons/pi'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import FormLabel from '@/components/form-label'
import { TagsInput } from '@/components/tags-input'
import Tooltip from '@/components/Tooltip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { defaultRequiredRegex, emailRegex } from '@/constants/regex'
import useAvailableGrantRoles from '@/hooks/useAvailableGrantRoles'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { inviteMultipleCoWorkersApi } from '@/network/apis/user'
import { useStore } from '@/stores/store'

import Button from '../../../components/button'

const formSchema = z.object({
  emails: z
    .array(z.string())
    .nonempty(defaultRequiredRegex.message)
    .refine(
      (emails) => {
        return emails.every((email) => emailRegex.pattern.test(email))
      },
      {
        message: emailRegex.message
      }
    ),
  role: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message),
  brand: z.string().optional()
})
const InviteCoWorker = () => {
  const { userData } = useStore(
    useShallow((state) => {
      return {
        userData: state.user
      }
    })
  )
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emails: [],
      role: '',
      brand: userData?.brands?.length ? userData?.brands[0].id : ''
    }
  })

  const [isOpened, setIsOpened] = useState(false)
  const { successToast } = useToast()
  const grantableRoles = useAvailableGrantRoles()
  const handleServerErrors = useHandleServerError()
  const { mutateAsync: inviteMultipleCoWorkersFn } = useMutation({
    mutationKey: [inviteMultipleCoWorkersApi.mutationKey],
    mutationFn: inviteMultipleCoWorkersApi.fn,
    onSuccess: () => {
      successToast({
        message: 'Amazing! Email invitation sent to your members.'
      })
    }
  })
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await inviteMultipleCoWorkersFn(values)
      form.reset({
        emails: [],
        role: ''
      })
      setIsOpened(false)
    } catch (error) {
      handleServerErrors({
        error
      })
    }
  }

  return (
    <Dialog open={isOpened || form.formState.isSubmitting} onOpenChange={setIsOpened}>
      <DialogTrigger asChild>
        <Button variant={'outline'} size={'sm'}>
          <UserPlus />
          <span>Invite Members</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>Send request to your members email to join your team.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col w-full gap-4'>
            <FormField
              control={form.control}
              name='emails'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Member emails</FormLabel>
                  <FormControl>
                    <div className='flex items-center gap-2 w-full'>
                      <TagsInput
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder='Enter your member email'
                        className='flex-1'
                      />
                      <Tooltip
                        trigger={
                          <Button className='px-3'>
                            <UploadIcon />
                          </Button>
                        }
                        content='Upload a CSV file with a list of emails to invite multiple members.'
                      />
                      <Tooltip
                        trigger={
                          <Button className='px-3'>
                            <PiMicrosoftExcelLogoBold />
                          </Button>
                        }
                        content='Download a CSV template to fill in the list of emails to invite multiple members.'
                      />
                    </div>
                  </FormControl>
                  <FormDescription>You can invite multiple members by entering their email addresses.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>members role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select members role' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {grantableRoles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.role}
                        </SelectItem>
                      ))}
                      {!grantableRoles.length && (
                        <SelectItem value='no-role' disabled>
                          No roles available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    You can assign a role to your members to manage their permissions. .
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' loading={form.formState.isSubmitting}>
              Send Invitation To Members
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default InviteCoWorker
