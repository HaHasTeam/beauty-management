'use client'

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
import { PhoneInputWithCountries } from '@/components/phone-input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Routes, routesConfig } from '@/configs/routes'
import { defaultRequiredRegex, emailRegex, phoneRegex } from '@/constants/regex'
import { useAppProvider } from '@/contexts/AppProvider'
import useHandleServerError from '@/hooks/useHandleServerError'
// import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { createUserApi, signInWithPasswordApi } from '@/network/apis/user'
import { useStore } from '@/stores/store'
import type { TInviteSignupDecoded } from '@/types/auth'
import { UserRoleEnum } from '@/types/role'
import { UserStatusEnum } from '@/types/user'

import OauthSignIn from './OauthSignIn'

// Define prop type with allowEmail boolean
// type SignUpProps = {
//   allowEmail: boolean
// }

const formSchema = z
  .object({
    email: z
      .string()
      .regex(defaultRequiredRegex.pattern, 'Please fill out this field')
      .regex(emailRegex.pattern, 'Please enter a valid email address'),
    password: z.string().regex(defaultRequiredRegex.pattern, 'Please fill out this field'),
    username: z.string().regex(defaultRequiredRegex.pattern, 'Please fill out this field'),
    phone: z.string().refine(phoneRegex.pattern, 'Please fill in a valid phone number').optional(),
    passwordConfirm: z.string().min(8).max(20)
    // acceptTerms: z.boolean()
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm']
  })
export default function SignUp() {
  const { rolesData } = useAppProvider()
  const navigate = useNavigate()
  const { successToast } = useToast()
  const code = new URLSearchParams(window.location.search).get('code')
  const authenticate = useStore(useShallow((state) => state.setAuthState))

  const prefillData = useMemo(() => {
    if (code) {
      return jwtDecode<TInviteSignupDecoded>(code)
    }
    return undefined
  }, [code])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: prefillData?.email || '',
      password: '',
      username: '',
      phone: '',
      passwordConfirm: ''
      // acceptTerms: false
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
    } catch {
      // handleServerError({
      //   error
      // })
    }
  }

  const handleServerError = useHandleServerError()
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const role = prefillData ? prefillData.role : rolesData[UserRoleEnum.MANAGER].id
      await createUserFn({
        email: values.email,
        password: values.password,
        username: values.username,
        phone: '0' + values?.phone?.slice(3),
        role,
        brands: prefillData?.brand ? [prefillData.brand] : undefined,
        isEmailVerify: prefillData ? true : false,
        status: UserStatusEnum.PENDING
      })
      await handleLogin(values.email, values.password).catch(() => {})
      const isManager = role === rolesData[UserRoleEnum.MANAGER].id

      if (isManager) {
        navigate(routesConfig[Routes.AUTH_EMAIL_VERIFICATION].getPath({ email: values.email }))
      } else {
        navigate(routesConfig[Routes.DASHBOARD_HOME].getPath())
      }
    } catch (error) {
      handleServerError({
        error,
        form
      })
    }
  }

  return (
    <div className='w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800'>
      <div className='px-8 pt-8 pb-4'>
        <h2 className='text-2xl font-bold text-center mb-2 text-gray-800 dark:text-white'>Create your account</h2>
        <p className='text-center text-gray-500 dark:text-gray-400 mb-6'>Fill in the details below to get started</p>

        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(onSubmit)} className='space-y-5' id={`form-${id}`}>
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required className='text-gray-700 dark:text-gray-300'>
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='h-11 rounded-lg border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                        placeholder='e.g. allure@gmail.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required className='text-gray-700 dark:text-gray-300'>
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='h-11 rounded-lg border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                        placeholder='Enter your full name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-700 dark:text-gray-300'>Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInputWithCountries className='h-11 rounded-lg' {...field} />
                    </FormControl>
                    <FormDescription className='text-xs text-gray-500 dark:text-gray-400'>
                      This is the phone number that will be displayed on your profile
                    </FormDescription>
                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required className='text-gray-700 dark:text-gray-300'>
                      Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        className='h-11 rounded-lg border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                        placeholder='••••••••'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='passwordConfirm'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required className='text-gray-700 dark:text-gray-300'>
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        className='h-11 rounded-lg border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                        placeholder='••••••••'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />
            </div>

            <div className='relative w-full'>
              <Button
                loading={form.formState.isSubmitting}
                type='submit'
                className='mt-2 flex h-[unset] w-full items-center justify-center rounded-lg px-4 py-4 text-sm font-medium'
              >
                Sign up
              </Button>
            </div>
          </form>
        </Form>
        <OauthSignIn />
      </div>

      <div className='px-8 py-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600'>
        <p className='text-center text-gray-600 dark:text-gray-300'>
          Already have an account?{' '}
          <Link to='/auth/signin/password-signin' className='text-[#FFA07A] hover:underline font-medium'>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
