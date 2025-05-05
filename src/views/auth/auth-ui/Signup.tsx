'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import i18next from 'i18next'
import { jwtDecode } from 'jwt-decode'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
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
import { defaultRequiredRegex, emailRegex, passwordRegexEasy, phoneRegex, usernameRegex } from '@/constants/regex'
import { useAppProvider } from '@/contexts/AppProvider'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { createUserApi, signInWithPasswordApi } from '@/network/apis/user'
import { useStore } from '@/stores/store'
import type { TInviteSignupDecoded } from '@/types/auth'
import { UserRoleEnum } from '@/types/role'
import { UserStatusEnum } from '@/types/user'

const getFormSchame = () => {
  return z
    .object({
      email: z
        .string()
        .regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message())
        .regex(emailRegex.pattern, emailRegex.message()),
      password: z.string().regex(passwordRegexEasy.pattern, passwordRegexEasy.message()),
      username: z
        .string()
        .regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message())
        .regex(usernameRegex.pattern, usernameRegex.message()),
      phone: z.string().refine(phoneRegex.pattern, phoneRegex.message()).optional(),
      passwordConfirm: z.string().regex(passwordRegexEasy.pattern, passwordRegexEasy.message())
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: i18next.t('signUp.passwordsDoNotMatch'),
      path: ['passwordConfirm']
    })
}

export default function SignUp() {
  const { t } = useTranslation()
  const { rolesData } = useAppProvider()
  const navigate = useNavigate()
  const { successToast } = useToast()
  const code = new URLSearchParams(window.location.search).get('code')
  const authenticate = useStore(useShallow((state) => state.setAuthState))
  const formSchema = getFormSchame()
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
    }
  })

  const { mutateAsync: createUserFn } = useMutation({
    mutationKey: [createUserApi.mutationKey],
    mutationFn: createUserApi.fn,
    onSuccess: () => {
      successToast({
        message: t('signUp.welcomeMessage', { email: form.getValues('email') })
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
    <div className=''>
      <div className=''>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required className='text-gray-700 dark:text-gray-300'>
                      {t('signUp.email')}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={t('signUp.emailPlaceholder')} {...field} />
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
                      {t('signUp.username')}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={t('signUp.usernamePlaceholder')} {...field} />
                    </FormControl>
                    <FormDescription className='text-xs text-gray-500 dark:text-gray-400'>
                      {t('validation.usernameHelper')}
                    </FormDescription>
                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-700 dark:text-gray-300'>{t('signUp.phone')}</FormLabel>
                    <FormControl>
                      <PhoneInputWithCountries className='h-11 rounded-lg' {...field} />
                    </FormControl>
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
                      {t('signUp.password')}
                    </FormLabel>
                    <FormControl>
                      <PasswordInput placeholder={t('signUp.passwordPlaceholder')} {...field} />
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
                      {t('signUp.confirmPassword')}
                    </FormLabel>
                    <FormControl>
                      <PasswordInput placeholder={t('signUp.confirmPasswordPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />
            </div>

            <div className='relative w-full'>
              <Button loading={form.formState.isSubmitting} type='submit' className='w-full'>
                {t('signUp.signUpButton')}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className='pt-6'>
        <p className='text-center text-sm text-gray-600 dark:text-gray-300'>
          {t('signUp.alreadyHaveAccount')}{' '}
          <Link to='/auth/signin/password-signin' className='text-primary hover:underline font-medium'>
            {t('signUp.signIn')}
          </Link>
        </p>
      </div>
    </div>
  )
}
