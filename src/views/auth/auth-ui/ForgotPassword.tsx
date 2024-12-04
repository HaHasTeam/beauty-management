import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'

import FormLabel from '@/components/form-label'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { defaultRequiredRegex, emailRegex } from '@/constants/regex'
// Define prop type with allowEmail boolean
type ForgotPasswordProps = {
  allowEmail: boolean
  disableButton?: boolean
}
const formSchema = z.object({
  email: z
    .string()
    .regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message)
    .regex(emailRegex.pattern, emailRegex.message)
})

export default function ForgotPassword({ allowEmail }: ForgotPasswordProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  })

  const id = useId()

  function onSubmit() {}
  return (
    <div className='mb-8'>
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className='w-full grid gap-4 mb-8' id={`form-${id}`}>
          <div className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Email</FormLabel>
                  <FormControl>
                    <Input
                      className='min-h-[50px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
                      placeholder='
                     e.g. allure@gmail.com
                    '
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type='submit'
            className='mt-2 flex h-[unset] w-full items-center justify-center rounded-lg px-4 py-4 text-sm font-medium'
          >
            Sign in
          </Button>
        </form>
      </Form>
      <p>
        <Link to='/auth/password_signin' className='font-medium text-sm dark:text-white'>
          Sign in with email and password
        </Link>
      </p>
      {allowEmail && (
        <p>
          <Link to='/auth/email_signin' className='font-medium text-sm dark:text-white'>
            Sign in via magic link
          </Link>
        </p>
      )}
      <p>
        <Link to='/auth/signup' className='font-medium text-sm dark:text-white'>
          Don't have an account? Sign up
        </Link>
      </p>
    </div>
  )
}
