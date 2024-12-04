import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { useId, useMemo } from 'react'
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
import { useAppProvider } from '@/contexts/AppProvider'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { createUserApi, signInWithPasswordApi } from '@/network/apis/user'
import { useStore } from '@/stores/store'
import { TInviteSignupDecoded } from '@/types/auth'
import { UserRoleEnum } from '@/types/role'

// Define prop type with allowEmail boolean
type SignUpProps = {
  allowEmail: boolean
}

const formSchema = z.object({
  email: z
    .string()
    .regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message)
    .regex(emailRegex.pattern, emailRegex.message),
  password: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message)
})
export default function SignUp({ allowEmail }: SignUpProps) {
  const { rolesData } = useAppProvider()
  const navigate = useNavigate()
  const { successToast } = useToast()
  const code = new URLSearchParams(window.location.search).get('code')

  const prefillData = useMemo(() => {
    if (code) {
      return jwtDecode<TInviteSignupDecoded>(code)
    }
    return undefined
  }, [code])

  const { authenticate } = useStore(
    useShallow((state) => ({
      authenticate: state.setAuthState
    }))
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const id = useId()

  const { mutateAsync: createUserFn } = useMutation({
    mutationKey: [createUserApi.mutationKey],
    mutationFn: createUserApi.fn,
    onSuccess: () => {
      successToast({
        message: `Welcome!, ${form.getValues('email')}, check your email for verification`
      })
    }
  })

  const { mutateAsync: signInWithPasswordFn } = useMutation({
    mutationKey: [signInWithPasswordApi.mutationKey],
    mutationFn: signInWithPasswordApi.fn
  })

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
    } catch (error) {
      handleServerError({
        error
      })
    }
  }

  const handleServerError = useHandleServerError()
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createUserFn({
        email: values.email,
        password: values.password,
        username: values.email,
        role: prefillData ? prefillData.role : rolesData[UserRoleEnum.MANAGER].id,
        brand: prefillData ? prefillData.brand : undefined
      })
      await handleLogin(values.email, values.password)
      navigate(routesConfig[Routes.AUTH_EMAIL_VERIFICATION].getPath({ email: values.email }))
    } catch (error) {
      handleServerError({
        error,
        form
      })
    }
  }

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

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      className='min-h-[50px] w-full px-4 py-3 focus:outline-0 dark:placeholder:text-zinc-400'
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
            loading={form.formState.isSubmitting}
            type='submit'
            className='mt-2 flex h-[unset] w-full items-center justify-center rounded-lg px-4 py-4 text-sm font-medium'
          >
            Sign up
          </Button>
        </form>
      </Form>
      <p>
        <Link to='/auth/signin/forgot_password' className='font-medium text-zinc-950 dark:text-white text-sm'>
          Forgot your password?
        </Link>
      </p>
      <p className='font-medium text-sm dark:text-white'>
        <Link to='/auth/signin/password_signin' className='font-medium text-sm dark:text-white'>
          Already have an account?
        </Link>
      </p>
      {allowEmail && (
        <p className='font-medium text-sm dark:text-white'>
          <Link to='/auth/signin/email_signin' className='font-medium text-sm dark:text-white'>
            Sign in via magic link
          </Link>
        </p>
      )}
    </div>
  )
}
