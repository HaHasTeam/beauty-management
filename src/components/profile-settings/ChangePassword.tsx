import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { MdOutlinePassword } from 'react-icons/md'
import * as z from 'zod'

import FormLabel from '@/components/form-label'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { requiredRegex } from '@/constants/regex'

import CardSection from '../CardSection'
import { PasswordInput } from '../password-input'
import { Button } from '../ui/button'

const formSchema = z
  .object({
    password: z.string().regex(requiredRegex().pattern, requiredRegex().message),
    newPassword: z.string().regex(requiredRegex().pattern, requiredRegex().message),
    confirmPassword: z.string().regex(requiredRegex().pattern, requiredRegex().message)
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Please make sure your new password and confirm password match',
    path: ['confirmPassword']
  })

const ChangePassword = () => {
  const id = useId()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <CardSection
      title='Change Password'
      description='
        You can change your password here. Make sure you remember your new password.'
      rightComponent={
        <Button type='submit' className='flex gap-2 items-center' form={`form-${id}`}>
          <MdOutlinePassword />
          <span>Change Password</span>
        </Button>
      }
    >
      <Form {...form}>
        <form
          id={`form-${id}`}
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className='gap-4 grid grid-flow-row grid-cols-1 sm:grid-cols-2'
        >
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Verify Current Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder='
                    e.g. ********
                  '
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your current password. Please enter it to verify your identity.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='newPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel required>New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder='
                    e.g. ********
                  '
                    {...field}
                  />
                </FormControl>
                <FormDescription>This is your new password. Make sure you remember it.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder='
                    e.g. ********
                  '
                    {...field}
                  />
                </FormControl>
                <FormDescription>Please confirm your new password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </CardSection>
  )
}

export default ChangePassword
