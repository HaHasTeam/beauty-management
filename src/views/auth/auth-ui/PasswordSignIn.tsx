import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import Button from '@/components/button'
import FormLabel from '@/components/form-label'
import { PasswordInput } from '@/components/password-input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Routes, routesConfig } from '@/configs/routes'
import { defaultRequiredRegex, emailRegex } from '@/constants/regex'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { signInWithPasswordApi } from '@/network/apis/user'
import { useStore } from '@/stores/store'

// Define prop type with allowEmail boolean
type PasswordSignInProps = {
  allowEmail: boolean
}
const formSchema = z.object({
  email: z
    .string()
    .regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message)
    .regex(emailRegex.pattern, emailRegex.message),
  password: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message)
})

export default function PasswordSignIn({ allowEmail }: PasswordSignInProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const { authenticate } = useStore(
    useShallow((state) => ({
      authenticate: state.setAuthState
    }))
  )
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const id = useId()
  const navigate = useNavigate()
  const handleLogin = async (email: string, password: string) => {
    try {
      const { data } = await signInWithPasswordFn({
        email,
        password
      })
      authenticate({
        isAuthenticated: true,
        authData: data
      })
      navigate(routesConfig[Routes.DASHBOARD_HOME].getPath())
    } catch (error) {
      handleServerError({
        error
      })
    }
  }
  const { mutateAsync: signInWithPasswordFn, isPending: isSignInWithPasswordLoading } = useMutation({
    mutationKey: [signInWithPasswordApi.mutationKey],
    mutationFn: signInWithPasswordApi.fn,
    onSuccess: () => {
      successToast({
        message: `Welcome back!, ${form.getValues('email')}`
      })
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await handleLogin(values.email, values.password)
  }

  return (
    <div>
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
                      className='h-[50px] focus:outline-0 dark:placeholder:text-zinc-400'
                      placeholder='e.g. allure@gmail.com'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      className='h-[50px] w-full focus:outline-0 dark:placeholder:text-zinc-400'
                      placeholder='e.g. ********'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            loading={isSignInWithPasswordLoading}
            type='submit'
            className='mt-2 flex h-[unset] w-full items-center justify-center rounded-lg px-4 py-4 text-sm font-medium'
          >
            Sign in
          </Button>
        </form>
      </Form>
      <p>
        <Link to='/auth/signin/forgot_password' className='font-medium text-zinc-950 dark:text-white text-sm'>
          Forgot your password?
        </Link>
      </p>
      {allowEmail && (
        <p>
          <Link to='/auth/signin/email_signin' className='font-medium text-zinc-950 dark:text-white text-sm'>
            Sign in via magic link
          </Link>
        </p>
      )}
      <p>
        <Link to='/auth/signup' className='font-medium text-zinc-950 dark:text-white text-sm'>
          Don't have an account? Sign up
        </Link>
      </p>
    </div>
  )
}
