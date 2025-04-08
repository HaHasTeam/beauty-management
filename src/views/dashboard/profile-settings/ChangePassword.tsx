import { zodResolver } from '@hookform/resolvers/zod'
import { LockIcon, SaveIcon } from 'lucide-react'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import Button from '@/components/button'
import FormLabel from '@/components/form-label'
import { PasswordInput } from '@/components/password-input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { requiredRegex } from '@/constants/regex'

const formSchema = z
  .object({
    password: z.string().regex(requiredRegex().pattern, requiredRegex().message()),
    newPassword: z.string().regex(requiredRegex().pattern, requiredRegex().message()),
    confirmPassword: z.string().regex(requiredRegex().pattern, requiredRegex().message())
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

  function onSubmit() {}

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <LockIcon />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              id={`form-${id}`}
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
              className='gap-4 grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
      <Button type='submit' className='flex gap-2 items-center mt-8 ml-auto' form={`form-${id}`}>
        <SaveIcon />
        Change Password
      </Button>
    </>
  )
}

export default ChangePassword
